// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tokio::sync::mpsc;
use tracing::info;

mod processes;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    info!("Starting application");
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    let (tx, mut rx) = mpsc::channel::<String>(1);

    tokio::spawn(async move {
        info!("Starting axum server");
        processes::server::start_server(tx.clone()).await;
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let app_handle = app.handle();

            tauri::async_runtime::spawn(async move {
                loop {
                    if let Some(output) = rx.recv().await {
                        info!("Got request to tauri from axum: {:?}", output);
                        app_handle.emit_all("update", output).unwrap();
                    }
                }
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => api.prevent_exit(),
            _ => {}
        });
}

#[derive(Debug, serde::Deserialize)]
struct TestData {
    name: String,
}

async fn _async_process_model(
    mut input_rx: mpsc::Receiver<String>,
    output_tx: mpsc::Sender<String>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    loop {
        while let Some(input) = input_rx.recv().await {
            let output = input;
            output_tx.send(output).await?;
        }
    }
}

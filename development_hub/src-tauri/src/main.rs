// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::net::SocketAddr;

use axum::{extract::State, http::StatusCode, routing::get, routing::post, Json, Router};
use tauri::Manager;
use tokio::sync::mpsc;
use tracing::info;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel::<String>(1);
    let (async_proc_output_tx, mut async_proc_output_rx) = mpsc::channel::<String>(1);

    tokio::spawn(async move {
        info!("Starting axum server");
        axum_test(async_proc_input_rx, async_proc_output_tx).await;
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let app_handle = app.handle();

            tauri::async_runtime::spawn(async move {
                loop {
                    if let Some(output) = async_proc_output_rx.recv().await {
                        info!("Got request TO tauri from axum: {:?}", output);
                    }
                }
            });

            Ok(())
        })
        .run(|app_handle, event| match event {
            tauri::RunEvent::ExitRequested {api, ..} => api.prevent_exit(),
            _ => {}
        })
        .expect("error while running tauri application");
}

#[derive(Debug, Clone)]
struct AxumState {
    output_tx: mpsc::Sender<String>,
}

async fn axum_test(mut input_rx: mpsc::Receiver<String>, output_tx: mpsc::Sender<String>) -> () {
    // loop {
    //     while let Some(input) = input_rx.recv().await {
    //         let output = input;
    //         output_tx.send(output).await?;
    //     }
    // }

    let state = AxumState {
        output_tx: output_tx.clone(),
    };

    let app = Router::new()
        .route("/", get(root))
        .route("/", post(root_post))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3030));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root(State(state): State<AxumState>) -> &'static str {
    info!("Got a request");
    state
        .output_tx
        .send("Hello, World!".to_string())
        .await
        .unwrap();

    "Hello, World!"
}

#[derive(Debug, serde::Deserialize)]
struct TestData {
    name: String,
}

async fn root_post(
    State(state): State<AxumState>,
    Json(payload): Json<TestData>,
) -> (StatusCode, &'static str) {
    println!("Got a request: {:?}", payload);
    state.output_tx.send(payload.name).await.unwrap();
    (StatusCode::OK, "Hello, World!")
}

async fn async_process_model(
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

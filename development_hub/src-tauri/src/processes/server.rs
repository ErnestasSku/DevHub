use std::net::SocketAddr;

use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use tokio::sync::mpsc;
use tracing::info;

#[derive(Debug, Clone)]
struct AxumState {
    output_tx: mpsc::Sender<String>,
}

pub async fn start_server(output_channel: mpsc::Sender<String>) {
    let state = AxumState {
        output_tx: output_channel,
    };

    let app = Router::new()
        .route("/Task", post(task_post))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3030));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[derive(Debug, serde::Deserialize)]
pub struct Test {
    pub a: String,
    pub b: Option<String>,
}

async fn task_post(
    State(state): State<AxumState>,
    Json(payload): Json<Test>,
) -> (StatusCode, &'static str) {
    info!("Got a request");
    state.output_tx.send(payload.a).await.unwrap();
    (StatusCode::OK, "OK")
}

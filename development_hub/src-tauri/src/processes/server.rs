use std::net::SocketAddr;

use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use tokio::sync::mpsc;
use tracing::info;

use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

use super::server_types::{ServerType, TaskInfo};

#[derive(Debug, Clone)]
struct AxumState {
    output_tx: mpsc::Sender<ServerType>,
}

pub async fn start_server(output_channel: mpsc::Sender<ServerType>) {
    let state = AxumState {
        output_tx: output_channel,
    };

    let cors = CorsLayer::very_permissive();

    let app = Router::new()
        .route("/Task", post(task_post))
        .with_state(state)
        .layer(ServiceBuilder::new().layer(cors));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3030));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn task_post(
    State(state): State<AxumState>,
    Json(payload): Json<TaskInfo>,
) -> (StatusCode, &'static str) {
    info!("Got a request");
    dbg!(payload.clone());

    state
        .output_tx
        .send(ServerType::Task(payload))
        .await
        .unwrap();
    (StatusCode::OK, "OK")
}

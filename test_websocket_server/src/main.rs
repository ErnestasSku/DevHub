use axum::{http::StatusCode, routing::get, routing::post, Json, Router};
use std::net::SocketAddr;

use futures_util::{FutureExt, StreamExt};
// use warp::Filter;

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    // println!("Running ws");
    // let routes = warp::path("echo")
    //     // The `ws()` filter will prepare the Websocket handshake.
    //     .and(warp::ws())
    //     .map(|ws: warp::ws::Ws| {
    //         println!("Got a request");
    //         // And then our closure will be called when it completes...
    //         ws.on_upgrade(|websocket| {
    //             println!("Upgraded");
    //             // Just echo all messages back...
    //             let (tx, rx) = websocket.split();
    //             rx.forward(tx).map(|result| {
    //                 if let Err(e) = result {
    //                     eprintln!("websocket error: {:?}", e);
    //                 }
    //             })
    //         })
    //     });

    // warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;

    let app = Router::new()
        .route("/", get(root))
        .route("/", post(root_post));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3030));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}

#[derive(Debug, serde::Deserialize)]
struct TestData {
    name: String,
}

async fn root_post(Json(payload): Json<TestData>) -> (StatusCode, &'static str) {
    println!("Got a request: {:?}", payload);
    (StatusCode::OK, "Hello, World!")
}

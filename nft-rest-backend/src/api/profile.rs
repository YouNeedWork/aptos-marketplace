use actix_web::{get, web, App, HttpServer, Responder, post, delete, put};

#[get("/api/profile")]
pub async fn all_profile(address: web::Path<String>) -> impl Responder {

    format!("Hello {address}!")
}

#[post("/api/profile")]
pub async fn new_profile(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[put("/api/profile")]
pub async fn update_profile(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

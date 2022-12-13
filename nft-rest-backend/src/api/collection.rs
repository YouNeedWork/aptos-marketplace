use actix_web::{get, web, App, HttpServer, Responder, post, delete, put};

#[get("/api/collection")]
pub async fn all_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[post("/api/collection")]
pub async fn post_new_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[delete("/api/collection")]
pub async fn delete_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[put("/api/collection")]
pub async fn update_collection(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

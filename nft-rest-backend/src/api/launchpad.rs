use actix_web::{delete, get, post, put, web, App, HttpServer, Responder};

#[get("/api/launchpad")]
pub async fn all_launchpad(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[post("/api/launchpad")]
pub async fn post_new_launchpad(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[delete("/api/launchpad")]
pub async fn delete_launchpad(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[put("/api/launchpad")]
pub async fn update_launchpad(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

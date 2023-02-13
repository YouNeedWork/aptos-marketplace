#[derive(Debug, Clone)]
pub struct MemStore {
    pub redis: redis::Client,
}

impl MemStore {
    pub fn new() -> Self {
        let client = redis::Client::open("redis://127.0.0.1/").unwrap();
        Self { redis: client }
    }
}

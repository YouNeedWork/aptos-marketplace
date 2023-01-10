use crate::db;
use crate::models::table_items;

use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;
use redis::Client;

pub async fn fetch_nfts_on_market(_redis: Client, pg: db::DbPool) {
    let conn: PooledConnection<ConnectionManager<PgConnection>> =
        pg.get().expect("couldn't get db connection from pool");

    let nfts = table_items::query_items_by_handle(
        conn,
        "0xaeef8b346d7241bdc8db8b0ccc474b071e3b86f53e7dde459f154d1ea0554258",
    )
    .unwrap();

    dbg!(&nfts);
}

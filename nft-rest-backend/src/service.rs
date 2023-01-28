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

    // query the market items;

    //select c.* from (select count(1) % 2 as onmarket,decoded_key from table_items where table_handle = '0xaeef8b346d7241bdc8db8b0ccc474b071e3b86f53e7dde459f154d1ea0554258' group by decoded_key) as c where c.onmarket >0

    //select * from table_items where decoded_key in '{"token_data_id": {"name": "Test Nft #16", "creator": "0xeebac1f5eea4446fd71e79a00660e91c03af910ef700f9f4d201f42c83a8f0d0", "collection": "Test Nft"}, "property_version": "0"}' and is_deleted = 'f' order by transaction_version desc limit 1;

    //select * from table_items where decoded_key = '{"token_data_id": {"name": "Test Nft #16", "creator": "0xeebac1f5eea4446fd71e79a00660e91c03af910ef700f9f4d201f42c83a8f0d0", "collection": "Test Nft"}, "property_version": "0"}' and is_deleted = 'f' order by transaction_version desc limit 1;

    // Query the detail for items;

    // Save to redis.

    dbg!(&nfts);
}


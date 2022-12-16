use anyhow::Result;
use bigdecimal::BigDecimal;
use diesel::associations::HasTable;
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use field_count::FieldCount;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use tracing::info;

use crate::schema;
use schema::*;


/// Need a separate struct for queryable because we don't want to define the inserted_at column (letting DB fill)
#[derive(Debug, Identifiable, Queryable)]
#[diesel(primary_key(collection_data_id_hash))]
#[diesel(table_name = current_collection_datas)]
pub struct CurrentCollectionDataQuery {
    pub collection_data_id_hash: String,
    pub creator_address: String,
    pub collection_name: String,
    pub description: String,
    pub metadata_uri: String,
    pub supply: BigDecimal,
    pub maximum: BigDecimal,
    pub maximum_mutable: bool,
    pub uri_mutable: bool,
    pub description_mutable: bool,
    pub last_transaction_version: i64,
    pub inserted_at: chrono::NaiveDateTime,
}


pub fn query_info_by_collection(
    mut db: PooledConnection<ConnectionManager<PgConnection>>,
    address: &str,
    c_name: &str,
) -> Result<Vec<CurrentCollectionDataQuery>> {
    use crate::schema::current_collection_datas::dsl::*;

    info!("Querying nfts by collection");

    let results = current_collection_datas::table()
        .filter(creator_address.eq(address))
        .filter(collection_name.eq(c_name))
        .limit(20)
        .load::<CurrentCollectionDataQuery>(&mut *db)?;

    //println!("Displaying {} posts", results.len());
    Ok(results)
}

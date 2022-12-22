module CargosMarket::marketplace {
    use aptos_token::token::{Token, TokenId, MintTokenEvent};
    use aptos_std::table::Table;
    use std::signer;
    use aptos_token::token;
    use std::string::String;
    use aptos_std::table;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin;
    use std::vector;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Coin};
    use aptos_framework::event::{EventHandle, emit_event};
    use std::signer::address_of;
    use aptos_framework::event;
    use aptos_framework::account;


    struct ListEvent has drop, store {
        seller_address: address,
        seller_price:u64,
        seller_token_id: TokenId,
    }

    struct BuyEvent has drop, store {
        seller_address: address,
        buyer_price:u64,
        buyer_address:address,
        buyer_token_id: TokenId,
    }

    struct ListedItem has store {
        price: u64,
        locked_token: Token,
        seller_address: address,
        royalty: u64,
        offers: vector<ItemOffer>,
    }

    struct ItemOffer has store {
        buyer: address,
        amount: Coin<AptosCoin>,
    }

    struct Items has key {
        take_market_tax:bool,
        market_depositor: address,
        market_denominator: u64,
        market_fee: u64,
        items: Table<TokenId, ListedItem>,
        list_event:EventHandle<ListEvent>,
        buy_event:EventHandle<BuyEvent>,
    }

    public entry fun init_model(owner:&signer){
        assert!(address_of(owner)==@CargosMarket, 0);

        //init signer
        if (!exists<Items>(@CargosMarket)) {
            move_to(owner, Items {
                take_market_tax:false,
                market_denominator:10000,
                market_fee: 200,
                market_depositor:@CargosMarket,
                items: table::new<TokenId, ListedItem>(),
                list_event: account::new_event_handle<ListEvent>(owner),
                buy_event: account::new_event_handle<BuyEvent>(owner)
            });
        };
    }


    public entry fun list_token(
        sender: &signer,
        creators: vector<address>,
        collection_names: vector<String>,
        names: vector<String>,
        prices: vector<u64>,
        royaltys: vector<u64>,
    ) acquires Items {
        assert!(!vector::is_empty(&creators), 0);
        assert!(!vector::is_empty(&collection_names), 0);
        assert!(!vector::is_empty(&names), 0);
        assert!(!vector::is_empty(&prices), 0);
        assert!(!vector::is_empty(&royaltys), 0);

        assert!(
            vector::length(&creators) == vector::length(&collection_names) &&
            vector::length(&creators) == vector::length(&names) &&
            vector::length(&creators) == vector::length(&prices) &&
            vector::length(&creators) == vector::length(&royaltys),
            0
        );

        let seller_address = address_of(sender);


        let listed_items_data = borrow_global_mut<Items>(@CargosMarket);
        let listed_items = &mut listed_items_data.items;

        let i = 0;
        let creators_length = vector::length(&creators);

        while (i < creators_length) {
            let creator = *vector::borrow(&creators, i);
            let collection_name = *vector::borrow(&collection_names, i);
            let name = *vector::borrow(&names, i);
            let price = *vector::borrow(&prices, i);
            let royalty = *vector::borrow(&royaltys, i);

            let token_id = token::create_token_id_raw(creator, collection_name, name, 0);
            let locked_token = token::withdraw_token(sender, token_id, 1);
            table::add(listed_items, token_id, ListedItem {
                royalty,
                price,
                locked_token,
                seller_address,
                offers: vector::empty(),
            });

            emit_event(&mut listed_items_data.list_event,ListEvent{
                seller_address,
                seller_price:price,
                seller_token_id:token_id,
            });

            i = i + 1;
        }
    }


    public entry fun buy_token(
        sender: &signer,
        creators: vector<address>,
        collection_names: vector<String>,
        names: vector<String>,
    ) acquires Items {
        assert!(!vector::is_empty(&creators), 0);
        assert!(!vector::is_empty(&collection_names), 0);
        assert!(!vector::is_empty(&names), 0);

        assert!(
            vector::length(&creators) == vector::length(&collection_names) &&
                vector::length(&creators) == vector::length(&names),
            0
        );

        let listedItemsData = borrow_global_mut<Items>(@CargosMarket);
        let listed_items = &mut listedItemsData.items;


        let i = 0;
        let creators_length = vector::length(&creators);
        while (i < creators_length) {
            let creator = *vector::borrow(&creators, i);
            let collection_name = *vector::borrow(&collection_names, i);
            let name = *vector::borrow(&names, i);

            let token_id = token::create_token_id_raw(creator, collection_name, name, 0);

            //check if token is listed
            let ListedItem { price, locked_token,seller_address, offers,royalty } = table::remove(listed_items, token_id);
            cancel_offer(&mut offers);
            vector::destroy_empty(offers);
            let market_amount = price * listedItemsData.market_fee / listedItemsData.market_denominator;

            let royalty = token::get_royalty(token_id);
            let create_amount = price * token::get_royalty_numerator(&royalty) / token::get_royalty_denominator(&royalty);
            let seller_amount = price - market_amount - create_amount;

            coin::transfer<aptos_coin::AptosCoin>(sender, listedItemsData.market_depositor, market_amount);
            coin::transfer<aptos_coin::AptosCoin>(sender, token::get_royalty_payee(&royalty), create_amount);
            coin::transfer<aptos_coin::AptosCoin>(sender, seller_address, seller_amount);

            token::deposit_token(sender, locked_token);

            emit_event(&mut listedItemsData.buy_event,BuyEvent{
                buyer_address:signer::address_of(sender),
                buyer_price:price,
                buyer_token_id:token_id,
                seller_address,
            });

            i = i + 1;
        }
    }

    fun cancel_offer(offers: &mut vector<ItemOffer>) {
        let i = 0;
        let offer_length = vector::length(offers);
        while (i < offer_length) {
            let ItemOffer { buyer, amount } = vector::remove(offers, i);
            coin::deposit<aptos_coin::AptosCoin>(buyer, amount);
            i = i + 1;
        }
    }
}

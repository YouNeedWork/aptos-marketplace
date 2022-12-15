module CargosMarket::merkle_proof {
    use std::error;
    use std::hash;
    use std::vector;

    /// @dev When an invalid multi-proof is supplied. Proof flags length must equal proof length + leaves length - 1.
    const EINVALID_MULTI_PROOF: u64 = 0;
    const EVECTOR_LENGTH_MISMATCH: u64 = 1;

    /// @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
    /// defined by `root`. For this, a `proof` must be provided, containing
    /// sibling hashes on the branch from the leaf to the root of the tree. Each
    /// pair of leaves and each pair of pre-images are assumed to be sorted.
    public fun verify(
        proof: &vector<vector<u8>>,
        root: vector<u8>,
        leaf: vector<u8>
    ): bool {
        process_proof(proof, leaf) == root
    }

    /// @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
    /// from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
    /// hash matches the root of the tree. When processing the proof, the pairs
    /// of leafs & pre-images are assumed to be sorted.
    fun process_proof(proof: &vector<vector<u8>>, leaf: vector<u8>): vector<u8> {
        let computed_hash = leaf;
        let proof_length = vector::length(proof);
        let i = 0;

        while (i < proof_length) {
            computed_hash = hash_pair(computed_hash, *vector::borrow(proof, i));
            i = i + 1;
        };

        computed_hash
    }


    fun hash_pair(a: vector<u8>, b: vector<u8>): vector<u8> {
        if (lt(&a, &b)) efficient_hash(a, b) else efficient_hash(b, a)
    }

    public fun lt(a: &vector<u8>, b: &vector<u8>): bool {
        let i = 0;
        let len = vector::length(a);
        assert!(len == vector::length(b), error::invalid_argument(EVECTOR_LENGTH_MISMATCH));

        while (i < len) {
            let aa = *vector::borrow(a, i);
            let bb = *vector::borrow(b, i);
            if (aa < bb) return true;
            if (aa > bb) return false;
            i = i + 1;
        };

        false
    }

    fun efficient_hash(a: vector<u8>, b: vector<u8>): vector<u8> {
        vector::append(&mut a, b);
        hash::sha2_256(a)
    }

    #[test]
    fun test_verify() {
        let proof = vector::empty<vector<u8>>();
        vector::push_back(&mut proof, x"3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d");
        vector::push_back(&mut proof, x"2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6");
        let root = x"aea2dd4249dcecf97ca6a1556db7f21ebd6a40bbec0243ca61b717146a08c347";
        let leaf = x"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
        assert!(verify(&proof, root, leaf), 0);
    }

    #[test]
    fun test_verify_bad_proof() {
        let proof = vector::empty<vector<u8>>();
        vector::push_back(&mut proof, x"3e23e8160039594a33894f6564e1b1349bbd7a0088d42c4acb73eeaed59c009d");
        vector::push_back(&mut proof, x"2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6");
        let root = x"aea2dd4249dcecf97ca6a1556db7f21ebd6a40bbec0243ca61b717146a08c347";
        let leaf = x"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
        assert!(!verify(&proof, root, leaf), 0);
    }

    #[test]
    fun test_verify_bad_root() {
        let proof = vector::empty<vector<u8>>();
        vector::push_back(&mut proof, x"3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d");
        vector::push_back(&mut proof, x"2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6");
        let root = x"aea9dd4249dcecf97ca6a1556db7f21ebd6a40bbec0243ca61b717146a08c347";
        let leaf = x"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
        assert!(!verify(&proof, root, leaf), 0);
    }

    #[test]
    fun test_verify_bad_leaf() {
        let proof = vector::empty<vector<u8>>();
        vector::push_back(&mut proof, x"3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d");
        vector::push_back(&mut proof, x"2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6");
        let root = x"aea2dd4249dcecf97ca6a1556db7f21ebd6a40bbec0243ca61b717146a08c347";
        let leaf = x"ca978112ca1bbdc1fac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
        assert!(!verify(&proof, root, leaf), 0);
    }
}

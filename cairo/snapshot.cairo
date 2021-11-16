from starkware.cairo.common.cairo_builtins import (HashBuiltin, SignatureBuiltin)
from starkware.cairo.common.math import assert_nn_le
from starkware.cairo.common.dict import dict_squash
from starkware.cairo.common.signature import (verify_ecdsa_signature)
from merkle_tree import Request

# This program takes a snapshot of a store, and proves that the store is a superset of a previous snapshot.
# It also proves that all messages in the snapshot are stored in order.

func hash_request_tree{range_check_ptr, pedersen_ptr : HashBuiltin*}(blockNumber: felt, request_len: felt, request: Request*) -> (root_hash: felt):
    alloc_locals
    all_ordered(request_len, request)
    local range_check_ptr = range_check_ptr # Store range_check_ptr in a local variable to make it accessible after the call to all_ordered()
    before_block(blockNumber, request_len, request)

    
    # TODO: hash all
    # TODO: merkle tree
    return (1)
end

func before_block{range_check_ptr}(blockNumber: felt, request_len: felt, request: Request*):
    return ()
end

# Asserts that all the requests in the store are ordered
func all_ordered{range_check_ptr}(request_len : felt, request : Request*):
    alloc_locals
    local range_check_ptr = range_check_ptr
    if request_len == 1:
        return ()
    end

    let next_request = request + Request.SIZE
    request_le(request, next_request) 
    local range_check_ptr = range_check_ptr # Store range_check_ptr in a local variable to make it accessible after the call to request_le()
    return all_ordered(request_len-1, next_request)
end

# Checks a is less than or equal to b. Ordered by requestLinter, then user, then blockNumber, and finally numerically by message (where felts are interpretted as non negative integers)
# Solves revoked reference as per https://cairo-lang.org/docs/how_cairo_works/builtins.html#revoked-implicit-arguments @guthl I have no idea how revoked references work or why lol
func request_le{range_check_ptr}(a: Request*, b: Request*):
    assert_nn_le(a.requestLinter, b.requestLinter)

    if a.requestLinter == b.requestLinter:
        assert_nn_le(a.user, b.user)
        tempvar range_check_ptr = range_check_ptr
        if a.user == b.user:
            assert_nn_le(a.blockNumber, b.blockNumber)
            if a.blockNumber == b.blockNumber:
                assert_nn_le(a.message1, b.message1)
                if a.message1 == b.message1:
                    assert_nn_le(a.message2, b.message2)
                    if a.message2 == b.message2:
                        assert_nn_le(a.message3, b.message3)
                        if a.message3 == b.message3:
                            assert_nn_le(a.message4 + 1, b.message4)
                        else:
                            tempvar range_check_ptr = range_check_ptr
                        end
                    else:
                        tempvar range_check_ptr = range_check_ptr
                    end
                else:
                    tempvar range_check_ptr = range_check_ptr
                end
            else:
                tempvar range_check_ptr = range_check_ptr
            end
        else:
            tempvar range_check_ptr = range_check_ptr
        end
    else:
        tempvar range_check_ptr = range_check_ptr
    end

    return ()
end

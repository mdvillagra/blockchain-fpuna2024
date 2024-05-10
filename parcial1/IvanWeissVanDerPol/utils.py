import hashlib

# import poseidon

# security_level = 128
# input_rate = 3
# t = 4
# alpha = 5
# poseidon_new = poseidon.Poseidon(poseidon.parameters.prime_255, security_level, alpha, input_rate, t)

def hash_sha256(input_str):
    """
    Computes the SHA-256 hash of the given input string.

    Parameters:
    - input_str (str): The input string to hash.

    Returns:
    - str: The hexadecimal representation of the SHA-256 hash.
    """
    
    # poseidon_digest = poseidon_new.run_hash(input_str)

    # return poseidon_digest
    return hashlib.sha256(input_str.encode()).hexdigest()




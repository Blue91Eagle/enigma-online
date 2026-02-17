import string

ALPHABET = string.ascii_uppercase


def _clean_key(key: str) -> str:
    key = "".join([c for c in key.upper() if c in ALPHABET])

    if not key:
        raise ValueError("Key must contain at least 1 letter A-Z.")

    return key


def _clean_plugboard(pb: str):
    pb = pb.upper().replace(" ", "")
    mapping = {c: c for c in ALPHABET}

    if not pb:
        return mapping

    if len(pb) % 2 != 0:
        raise ValueError("Plugboard must have even number of letters.")

    used = set()

    for i in range(0, len(pb), 2):
        a, b = pb[i], pb[i + 1]

        if a not in ALPHABET or b not in ALPHABET:
            raise ValueError("Plugboard can only contain A-Z.")

        if a == b:
            raise ValueError("A letter cannot map to itself.")

        if a in used or b in used:
            raise ValueError("A letter can only appear once.")

        used.add(a)
        used.add(b)

        mapping[a] = b
        mapping[b] = a

    return mapping


def _shift(ch: str, amount: int) -> str:
    idx = ALPHABET.index(ch)
    return ALPHABET[(idx + amount) % 26]


def _unshift(ch: str, amount: int) -> str:
    idx = ALPHABET.index(ch)
    return ALPHABET[(idx - amount) % 26]


class EnigmaLike:
    def __init__(
            self,
            key: str,
            rotor1: int = 3,
            rotor2: int = 7,
            rotor3: int = 11,
            start_positions: str = "AAA",
            plugboard: str = ""
    ):
        self.key = _clean_key(key)

        self.r1 = rotor1 % 26
        self.r2 = rotor2 % 26
        self.r3 = rotor3 % 26

        sp = "".join([c for c in start_positions.upper() if c in ALPHABET])

        if len(sp) != 3:
            raise ValueError("start_positions must be 3 letters.")

        self.pos1 = ALPHABET.index(sp[0])
        self.pos2 = ALPHABET.index(sp[1])
        self.pos3 = ALPHABET.index(sp[2])

        self.plug = _clean_plugboard(plugboard)

        self.reflect = {ALPHABET[i]: ALPHABET[25 - i] for i in range(26)}

        self._step_count = 0

    def _step(self):
        self.pos1 = (self.pos1 + 1) % 26

        if self.pos1 == 0:
            self.pos2 = (self.pos2 + 1) % 26

            if self.pos2 == 0:
                self.pos3 = (self.pos3 + 1) % 26

    def _key_amount(self):
        k = self.key[self._step_count % len(self.key)]
        return ALPHABET.index(k)

    def transform(self, text: str) -> str:
        out = []

        for ch in text.upper():
            if ch not in ALPHABET:
                out.append(ch)
                continue

            self._step()

            key_amt = self._key_amount()
            self._step_count += 1

            ch = self.plug[ch]

            ch = _shift(ch, self.r1 + self.pos1 + key_amt)
            ch = _shift(ch, self.r2 + self.pos2)
            ch = _shift(ch, self.r3 + self.pos3)

            ch = self.reflect[ch]

            ch = _unshift(ch, self.r3 + self.pos3)
            ch = _unshift(ch, self.r2 + self.pos2)
            ch = _unshift(ch, self.r1 + self.pos1 + key_amt)

            ch = self.plug[ch]

            out.append(ch)

        return "".join(out)


def encrypt(plain: str, **settings) -> str:
    machine = EnigmaLike(**settings)
    return machine.transform(plain)


def decrypt(cipher: str, **settings) -> str:
    machine = EnigmaLike(**settings)
    return machine.transform(cipher)

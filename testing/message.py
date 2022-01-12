import datetime as dt
import random

start_time = dt.datetime.now().microsecond

# noise values
last_value_0 = random.randrange(256)
last_value_1 = random.randrange(256)

class Message:
    def __init__(self, id: int, payload: list) -> None:
        self.id = id
        # create list of 8 bytes to store data in
        self.buf = list(word for word in payload)
        self.timestamp = dt.datetime.now().microsecond - start_time

    def __str__(self) -> str:
        m = ""
        m += str(hex(self.id)) + ','
        for word in self.buf:
            m += str(word) + ','
        m += str(self.timestamp)
        return m

    @classmethod
    def rand(cls) -> None:
        global last_value_1
        # telemetry Node CAN IDs
        ids = [0x470, 0x471, 0x472, 0x473, 0x475]
        id = random.choice(ids)

        # Choose random buffer data
        value_0 = last_value_0
        value_1 = last_value_1 + random.randrange(-10, 10)
        last_value_1 = value_1
        buf = [0] * 8
        buf[0] = value_0
        buf[1] = value_1

        return cls(id, buf)

# if __name__ == '__main__':
#     m = Message.rand()
#     print(m)

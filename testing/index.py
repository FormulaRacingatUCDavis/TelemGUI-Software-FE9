import datetime as dt


class Message:
    def __init__(self, id: int, payload: list) -> None:
        self.id = id
        # create list of 8 bytes to store data in
        self.buf = list(word for word in payload)
        self.timestamp = dt.datetime.now()

    def __str__(self) -> str:
        m = ""
        m += str(hex(self.id)) + ','
        for word in self.buf:
            m += str(word) + ','
        m += self.timestamp.strftime("%H:%M:%S")
        return m


if __name__ == '__main__':
    m = Message(17, [1, 2, 3, 4, 5, 6, 7, 8])
    print(m)

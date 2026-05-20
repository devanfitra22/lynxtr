def read_ltr(file):

    with open(file, "r") as f:
        code = f.read()

    print("[LYNXTR]")
    print("Reading:", file)
    print()
    print(code)

read_ltr("main.ltr")
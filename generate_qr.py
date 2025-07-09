import qrcode

def main():
    data = input("Enter the text or URL to encode as a QR code: ")
    fill_color = input("Enter the QR code color (e.g., 'black', 'blue', '#FF0000'): ") or 'black'
    back_color = input("Enter the background color (e.g., 'white', '#FFFFFF'): ") or 'white'
    qr = qrcode.QRCode()
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(navy= fill_color ,  grey= back_color)
    filename = input("Enter the filename to save the QR code image (e.g., 'qrcode.png'): ")
    if not filename.lower().endswith('.png'):
        filename += '.png'
    img.save(filename)
    print(f"QR code saved as {filename}")

if __name__ == "__main__":
    main()

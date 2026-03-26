import requests
import pathlib
import sys

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not installed. Please install it.")
    sys.exit(1)

def download_and_extract():
    try:
        session = requests.Session()
        url = "https://drive.google.com/uc?export=download&id=18erTRy9-3mTMbnmkaPL4lTakSfhwW6bo"
        print(f"Downloading from {url}...")
        r = session.get(url, stream=True)
        
        token = None
        for k, v in r.cookies.items():
            if k.startswith("download_warning"):
                token = v
                break
                
        if token:
            print("Handling large file confirmation...")
            r = session.get(url + "&confirm=" + token, stream=True)
            
        path = pathlib.Path("norcet_temp.pdf")
        path.write_bytes(r.content)
        print("Download complete. Extracting text...")
        
        reader = PdfReader(path)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"--- PAGE {i+1} ---\n"
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
            
        out_path = pathlib.Path("norcet_extracted.txt")
        out_path.write_text(text, encoding="utf-8")
        print(f"Extraction successful! {len(reader.pages)} pages written to norcet_extracted.txt")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    download_and_extract()

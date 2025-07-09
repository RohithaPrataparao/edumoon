import os
import sys
from datetime import datetime
from cryptography.fernet import Fernet, InvalidToken
import base64
import json

NOTES_FILE = "encrypted_notes.json"

# Generate a new Fernet key for each session (notes will only be accessible in this session)
fernet = Fernet(Fernet.generate_key())

def load_notes():
    try:
        if not os.path.exists(NOTES_FILE):
            return []
        with open(NOTES_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("Error: Notes file is corrupted. Starting with an empty list.")
                return []
    except Exception as e:
        print(f"Error loading notes: {e}")
        return []

def save_notes(notes):
    try:
        with open(NOTES_FILE, "w", encoding="utf-8") as f:
            json.dump(notes, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving notes: {e}")

def save_notes_with_reindexed_ids(notes):
    # Reindex ids to be sequential starting from 1
    for idx, note in enumerate(notes, 1):
        note['id'] = idx
    save_notes(notes)

def add_note():
    try:
        notes = load_notes()  # Ensure latest notes are loaded before adding
        while True:
            title = input("Enter note title: ").strip()
            if not title:
                print("Title cannot be empty.")
                continue
            break
        while True:
            content = input("Enter note content: ").strip()
            if not content:
                print("Content cannot be empty.")
                continue
            break
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        note_data = f"[{timestamp}] {content}"
        try:
            encrypted_content = fernet.encrypt(note_data.encode()).decode()
        except Exception as e:
            print(f"Encryption error: {e}")
            return
        notes.append({"id": 0, "title": title, "content": encrypted_content})  # id will be reindexed
        save_notes_with_reindexed_ids(notes)
        print("Note saved and encrypted!\n")
    except Exception as e:
        print(f"Error adding note: {e}")

def list_notes():
    try:
        notes = load_notes()
        if not notes:
            print("No notes found.\n")
            return []
        print("\nList of notes:")
        for idx, note in enumerate(notes, 1):
            note_id = note.get('id', idx)
            print(f"{idx}. [ID: {note_id}] {note['title']}")
        print()
        return notes
    except Exception as e:
        print(f"Error listing notes: {e}")
        return []

def view_note():
    try:
        notes = list_notes()
        if not notes:
            return
        idx = int(input("Enter note number to view: "))
        if 1 <= idx <= len(notes):
            encrypted_content = notes[idx-1]["content"]
            try:
                decrypted = fernet.decrypt(encrypted_content.encode()).decode()
                print(f"\nTitle: {notes[idx-1]['title']}\n{decrypted}\n")
            except InvalidToken:
                print("Could not decrypt note: wrong key or corrupted data.\n")
            except Exception as e:
                print(f"Decryption error: {e}")
        else:
            print("Invalid note number.\n")
    except ValueError:
        print("Invalid input.\n")
    except Exception as e:
        print(f"Error viewing note: {e}")

def delete_note():
    try:
        notes = list_notes()
        if not notes:
            return
        idx = int(input("Enter note number to delete: "))
        if 1 <= idx <= len(notes):
            del notes[idx-1]
            save_notes_with_reindexed_ids(notes)
            print("Note deleted.\n")
        else:
            print("Invalid note number.\n")
    except ValueError:
        print("Invalid input.\n")
    except Exception as e:
        print(f"Error deleting note: {e}")

def migrate_old_notes():
    old_file = "encrypted_notes.dat"
    if not os.path.exists(old_file):
        print("No old notes file found to migrate.")
        return
    migrated_notes = []
    with open(old_file, "rb") as f:
        lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            line = line.strip()
            if not line:
                continue
            try:
                decrypted = fernet.decrypt(line).decode()
                print(f"Decrypted note #{idx}: {decrypted}")
                title = input(f"Enter a title for note #{idx}: ").strip()
                while not title:
                    print("Title cannot be empty.")
                    title = input(f"Enter a title for note #{idx}: ").strip()
                migrated_notes.append({"id": idx, "title": title, "content": line.decode()})
            except Exception as e:
                print(f"Could not decrypt note #{idx}: {e}")
    if migrated_notes:
        # Save to new JSON file
        try:
            if os.path.exists(NOTES_FILE):
                notes = load_notes()
                # Find the max id in existing notes
                max_id = max((note.get('id', 0) for note in notes), default=0)
            else:
                notes = []
                max_id = 0
            # Update ids for migrated notes to avoid duplicates
            for i, note in enumerate(migrated_notes, 1):
                note['id'] = max_id + i
            notes.extend(migrated_notes)
            save_notes(notes)
            print(f"Migrated {len(migrated_notes)} notes to {NOTES_FILE}.")
        except Exception as e:
            print(f"Error saving migrated notes: {e}")
    else:
        print("No notes migrated.")

def main():
    print("Welcome to Secure Notes CLI!")
    while True:
        print("""
1. Add Note
2. List Notes
3. View Note
4. Delete Note
5. Exit
""")
        choice = input("Choose an option (1-5): ").strip()
        if choice == '1':
            add_note()
        elif choice == '2':
            list_notes()
        elif choice == '3':
            view_note()
        elif choice == '4':
            delete_note()
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select 1-5.\n")

if __name__ == "__main__":
    main()

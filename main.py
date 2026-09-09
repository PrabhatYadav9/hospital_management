patients = []
next_id = 1


def add_patient():
    global next_id
    name = input("Enter patient name: ").strip()
    age = input("Enter patient age: ").strip()
    gender = input("Enter gender (M/F/O): ").strip().upper()
    disease = input("Enter disease/diagnosis: ").strip()
    doctor = input("Enter assigned doctor: ").strip()

    patient = {
        "id": next_id,
        "name": name,
        "age": age,
        "gender": gender,
        "disease": disease,
        "doctor": doctor,
        "status": "Admitted",
    }

    patients.append(patient)
    next_id += 1
    print(f"Patient added successfully! ID: {patient['id']}\n")


def view_patients():
    if not patients:
        print("No patient records found.\n")
        return

    print(
        "\n{:<5}{:<20}{:<8}{:<10}{:<20}{:<20}{:<15}".format(
            "ID", "Name", "Age", "Gender", "Disease", "Doctor", "Status"
        )
    )
    print("-" * 100)

    for p in patients:
        print(
            "{:<5}{:<20}{:<8}{:<10}{:<20}{:<20}{:<15}".format(
                p["id"],
                p["name"],
                p["age"],
                p["gender"],
                p["disease"],
                p["doctor"],
                p["status"],
            )
        )
    print()


def find_by_id(patient_id):
    for p in patients:
        if p["id"] == patient_id:
            return p
    return None


def search_patient():
    if not patients:
        print("No patient records found.\n")
        return

    keyword = input("Enter Patient ID or Name to search: ").strip()
    results = []

    for p in patients:
        if keyword.isdigit() and p["id"] == int(keyword):
            results.append(p)
        elif keyword.lower() in p["name"].lower():
            results.append(p)

    if not results:
        print("No matching patient found.\n")
        return

    for p in results:
        print(f"\nID: {p['id']}")
        print(f"Name: {p['name']}")
        print(f"Age: {p['age']}")
        print(f"Gender: {p['gender']}")
        print(f"Disease: {p['disease']}")
        print(f"Doctor: {p['doctor']}")
        print(f"Status: {p['status']}")
        print()


def update_patient():
    if not patients:
        print("No patient records found.\n")
        return

    patient_id = input("Enter Patient ID to update: ").strip()

    if not patient_id.isdigit():
        print("Invalid ID.\n")
        return

    patient = find_by_id(int(patient_id))

    if not patient:
        print("Patient not found.\n")
        return

    print("Leave field blank to keep current value.")

    name = input(f"Name [{patient['name']}]: ").strip()
    age = input(f"Age [{patient['age']}]: ").strip()
    disease = input(f"Disease [{patient['disease']}]: ").strip()
    doctor = input(f"Doctor [{patient['doctor']}]: ").strip()

    if name:
        patient["name"] = name
    if age:
        patient["age"] = age
    if disease:
        patient["disease"] = disease
    if doctor:
        patient["doctor"] = doctor

    print("Patient record updated.\n")


def discharge_patient():
    if not patients:
        print("No patient records found.\n")
        return

    patient_id = input("Enter Patient ID to discharge: ").strip()

    if not patient_id.isdigit():
        print("Invalid ID.\n")
        return

    patient = find_by_id(int(patient_id))

    if not patient:
        print("Patient not found.\n")
        return

    patient["status"] = "Discharged"
    print(f"{patient['name']} has been discharged.\n")


def delete_patient():
    if not patients:
        print("No patient records found.\n")
        return

    patient_id = input("Enter Patient ID to delete: ").strip()

    if not patient_id.isdigit():
        print("Invalid ID.\n")
        return

    patient = find_by_id(int(patient_id))

    if not patient:
        print("Patient not found.\n")
        return

    patients.remove(patient)
    print("Patient record deleted.\n")


def menu():
    while True:
        print("====== Hospital Patient Records ======")
        print("1. Add Patient")
        print("2. View All Patients")
        print("3. Search Patient")
        print("4. Update Patient")
        print("5. Discharge Patient")
        print("6. Delete Patient")
        print("7. Exit")

        choice = input("Choose an option: ").strip()

        if choice == "1":
            add_patient()
        elif choice == "2":
            view_patients()
        elif choice == "3":
            search_patient()
        elif choice == "4":
            update_patient()
        elif choice == "5":
            discharge_patient()
        elif choice == "6":
            delete_patient()
        elif choice == "7":
            print("Goodbye!")
            break
        else:
            print("Invalid choice, try again.\n")


menu()
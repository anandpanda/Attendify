from django.http import JsonResponse
from db_connections import students_collection
from django.views.decorators.csrf import csrf_exempt
import json
from ml.addNewKnownFaces.addNewKnownFace import add_new_known_faces


@csrf_exempt
def add_students(request):
    """
    Function to add multiple students to the MongoDB 'students' collection.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract the list of students from the JSON data
            students_data = data.get('students', [])

            student_docs = []
            new_students = [] 
            for student in students_data:

                name = student.get('name')
                enroll = student.get('enroll')
                batch = student.get('batch')
                year = student.get('year')
                student_image_url = student.get('student_image_url')
                branch = student.get('branch', 'CSE')  # Default to 'CSE'
                image = student.get('image')

                # Validate required fields for each student
                if not all([name, enroll, batch, year, student_image_url, branch , image]):
                    return JsonResponse({"error": "Missing required fields"}, status=400)

                student_doc = {
                    "name": name,
                    "enroll": int(enroll),
                    "batch": batch,
                    "year": int(year),
                    "student_image_url": student_image_url,
                    "branch": branch
                }

                student_docs.append(student_doc)

                new_students.append({"enroll": enroll, "studImage": image})

            students_collection.insert_many(student_docs)

            add_new_known_faces(new_students)

            # Return success response
            return JsonResponse({"message": "Students added successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

<#--This is a simple, generated example for testing purposes. It is recommended to create a HTML when implementing-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
            crossorigin="anonymous"></script>
    <title>Form.io Form Submission Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f7f6;
        }

        #formio {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .formio-component input, .formio-component select, .formio-component textarea, .formio-component button {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .formio-component button {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        .formio-component button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
<div id="formio"></div>
<script src="https://cdn.form.io/formiojs/formio.full.min.js"></script>
<script>
    const formJson = ${form_io_form};

    Formio.createForm(document.getElementById('formio'), formJson).then(function (form) {
        form.on('submit', function (submission) {
            console.log('Form submitted', submission);

            fetch('${public_task_url}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission.data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => console.log('Success:', data))
                .catch((error) => console.error('Error:', error));

            // Prevent the default form submission behavior
            return false;
        });
    });
</script>
</body>
</html>

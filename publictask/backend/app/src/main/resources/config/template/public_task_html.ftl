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
                    // Check if the response is JSON or not
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        return response.json();
                    } else {
                        return response.text(); // Handle non-JSON responses
                    }
                })
                .then(data => {
                    console.log('Success:', data);
                    let message = data;
                    if (typeof data === 'object') {
                        message = JSON.stringify(data);
                    }
                    // Replace the form with the success or response message
                    document.getElementById('formio').innerHTML = `<div style="padding: 20px; border-radius: 8px; background-color: #dff0d8; color: #3c763d;">${message}</div>`;
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Optionally handle errors, e.g., show an error message
                });

            // Prevent the default form submission behavior
            return false;
        });
    });
</script>

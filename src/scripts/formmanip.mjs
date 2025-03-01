document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");
    const fields = [...form.querySelectorAll(".md.ques")]; // All form sections
    const submitBtn = document.getElementById("submitBtn");

    // Select the participation select input and the otherParticipation input
    const participationSelect = document.getElementById("participationSelect");
    const otherParticipationInput = document.getElementById("otherParticipation");

    // Hide all fields except the first one initially
    fields.forEach((field, index) => {
        field.style.display = index === 0 ? "block" : "none";
    });

    submitBtn.style.display = "none"; // Hide submit button initially

    // Function to reveal the next field
    function revealNextField(currentIndex) {
        if (currentIndex < fields.length - 1) {
            const nextField = fields[currentIndex + 1];
            nextField.style.display = "block";
            nextField.scrollIntoView({ behavior: "smooth", block: "center" });

            // If this is the last field, show the submit button
            if (currentIndex + 1 === fields.length - 1) {
                submitBtn.style.display = "block";
                submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    // Hide or show the "Other" participation input based on the selected option
    participationSelect.addEventListener("change", function () {
        if (participationSelect.value === "other") {
            otherParticipationInput.style.display = "block"; // Show the input
            otherParticipationInput.setAttribute("required", "true"); // Mark it as required
        } else {
            otherParticipationInput.style.display = "none"; // Hide the input
            otherParticipationInput.removeAttribute("required"); // Remove the required attribute
        }
    });

    // Add event listeners to inputs
    fields.forEach((field, index) => {
        const input = field.querySelector("input, select");
        if (!input) return;

        // Reveal the next field when any input is entered
        input.addEventListener("input", function () {
            if (input.value.trim() !== "") {
                revealNextField(index);
            }
        });

        // Handle Enter key for smooth transition and scrolling
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter" && input.value.trim() !== "") {
                event.preventDefault(); // Prevent form submission
                revealNextField(index);
            }
        });
    });

    // Handle form submission
    submitBtn.addEventListener("click", function (event) {
        event.preventDefault();  // Prevent the form from submitting the traditional way

        // Check if all required fields are filled before submitting
        const allFilled = [...form.querySelectorAll("input, select")]
            .every(input => input.value.trim() !== "");

        // Action 1: Display a confirmation message
        alert("Form successfully submitted!");

        // Action 2: Send data via fetch (AJAX)
        const formData = new FormData(form);  // Collect form data

        // Process the form data on the client side
        const name = formData.get('name');
        const affiliation = formData.get('affiliation');
        const participation = formData.get('participation');
        const otherParticipation = formData.get('otherParticipation') || ''; // Value for 'other'
        const email = formData.get('email');
        const message = formData.get('message');

        // Transform the data as per your requirements
        const role = affiliation === 'stu' ? 'stu' : affiliation === 'aux' ? 'aux' : '';
        let section = participation === 'other' ? otherParticipation : participation;  // 'other' corresponds to the free text field
        const roleWithDev = participation === 'NLP' ? `${section},dev` :
                            participation === 'HLP' ? `${section}` : 
                            participation === 'ALL' ? 'ALL' : section; // Handling 'ALL' case
        const other = message || ''
        // Prepare the processed data to send to the server
        const processedData = {
            name,
            section: section,
            email,
            role: roleWithDev,
            other,
        };

        // Send the processed data to the server via fetch
        fetch('/api/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Sending JSON
            },
            body: JSON.stringify(processedData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Form submitted successfully:', data);

            if (data.status === 'success') {
                // Action 3: Redirect to a "thank you" page or another success screen
                window.location.href = '/thank-you.html'; // Example redirect
            } else {
                alert('There was an issue with the submission. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during form submission:', error);
            alert('There was an error submitting the form.');
        });
    });
});

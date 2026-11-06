emailjs.init({
    publicKey: "poISQeiuqsqm5pWPt",
});

const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");
const submitButton = document.querySelector(".submit-btn");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    formMessage.className = "form-message";
    formMessage.textContent = "";

    emailjs.sendForm(
        "service_9mwq49s",
        "template_vup7e1l",
        contactForm
    ).then(
        function () {
            formMessage.textContent = "Your message has been sent successfully!";
            formMessage.className = "form-message success";

            contactForm.reset();

            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        },
        function (error) {
            formMessage.textContent = "Message could not be sent. Please try again.";
            formMessage.className = "form-message error";

            console.log("EmailJS Error:", error);

            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        }
    );
});

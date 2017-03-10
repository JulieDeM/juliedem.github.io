<?php

    // Only process POST requests.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $nameField = strip_tags(trim($_POST["name"]));
				$nameField = str_replace(array("\r","\n"),array(" "," "),$nameField);
        $emailField = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);
        $subjectField = trim($_POST["subject"]);
        // Check that data was sent to the mailer.
        if ( empty($nameField) OR empty($messageField) OR !filter_var($emailField, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            exit;
        }

        // Set the recipient email address.
        // FIXME: Update this to your desired email address.
        $recipient = "juliedemastersdeveloper@gmail.com";

        // Set the email subject.
        $subject = "New contact from $nameField";

        // Build the email content.
        $email_content = "Name: $nameField\n";
        $email_content .= "Email: $emailField\n\n";
        $email_content .= "Subject: $subjectField\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: $nameField <$emailField>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>

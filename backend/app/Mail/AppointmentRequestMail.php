<?php

namespace App\Mail;

use App\Models\Preorder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRequestMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(public Preorder $preorder)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau rendez-vous '.$this->preorder->appointment_code
                .' — '.$this->preorder->client_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-request',
            with: ['preorder' => $this->preorder],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

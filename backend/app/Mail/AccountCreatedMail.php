<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountCreatedMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public User $user,
        public string $plainPassword,
        public ?string $createdBy = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre compte The Key Group a été créé',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.account-created',
            with: [
                'user' => $this->user,
                'plainPassword' => $this->plainPassword,
                'createdBy' => $this->createdBy,
                'loginUrl' => rtrim((string) config('app.url'), '/').'/admin/login',
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

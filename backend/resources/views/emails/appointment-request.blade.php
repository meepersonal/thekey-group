<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Nouveau rendez-vous</title>
</head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
            <td style="background:#0f172a;padding:20px 28px;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.75;">The Key Group</p>
                <h1 style="margin:6px 0 0;font-size:20px;">Nouvelle demande de rendez-vous</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.5;">
                    Un client vient de demander un rendez-vous en agence.
                    Utilisez le code ci-dessous pour l'identifier dans l'administration.
                </p>

                <p style="margin:0 0 24px;">
                    <span style="display:inline-block;background:#f59e0b;color:#0f172a;font-size:28px;font-weight:bold;letter-spacing:6px;padding:12px 20px;border-radius:8px;">
                        {{ $preorder->appointment_code ?? '—' }}
                    </span>
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
                    @foreach ([
                        'Référence' => $preorder->reference,
                        'Véhicule' => $preorder->vehicle ? $preorder->vehicle->brand.' '.$preorder->vehicle->model : '—',
                        'Client' => $preorder->full_name ?: $preorder->client_name,
                        'Téléphone' => trim(($preorder->dial ?? '').' '.($preorder->phone ?? '')),
                        'E-mail' => $preorder->email ?: '—',
                        'Pays' => $preorder->country ?: '—',
                        'Ville' => $preorder->city ?: '—',
                        'Date souhaitée' => $preorder->appointment_date ?: '—',
                        'Heure souhaitée' => $preorder->appointment_time ?: '—',
                    ] as $label => $value)
                        <tr>
                            <td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top;">{{ $label }}</td>
                            <td style="padding:6px 0;font-weight:bold;">{{ $value }}</td>
                        </tr>
                    @endforeach
                </table>

                @if ($preorder->notes)
                    <p style="margin:22px 0 0;padding:14px 16px;background:#f8fafc;border-left:3px solid #f59e0b;font-size:13px;line-height:1.5;">
                        <strong>Notes du client :</strong><br>
                        {{ $preorder->notes }}
                    </p>
                @endif
            </td>
        </tr>
        <tr>
            <td style="padding:16px 28px;background:#f8fafc;font-size:12px;color:#64748b;">
                Message automatique —_The Key Group
            </td>
        </tr>
    </table>
</body>
</html>

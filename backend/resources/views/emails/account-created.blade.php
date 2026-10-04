<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Votre compte a été créé</title>
</head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
            <td style="background:#0f172a;padding:20px 28px;color:#ffffff;">
                <p style="margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.75;">The Key Group</p>
                <h1 style="margin:6px 0 0;font-size:20px;">Votre compte a été créé</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:28px;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.5;">
                    Bonjour {{ $user->name }},
                    @if ($createdBy)
                        {{ $createdBy }} vient de créer votre compte sur la plateforme The Key Group.
                    @else
                        Un administrateur vient de créer votre compte sur la plateforme The Key Group.
                    @endif
                    Vous pouvez désormais vous connecter avec les identifiants ci-dessous.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;background:#f8fafc;border-radius:8px;">
                    <tr>
                        <td style="padding:12px 16px;color:#64748b;width:40%;white-space:nowrap;">E-mail</td>
                        <td style="padding:12px 16px;font-weight:bold;font-family:monospace;">{{ $user->email }}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;color:#64748b;border-top:1px solid #e2e8f0;">Mot de passe</td>
                        <td style="padding:12px 16px;border-top:1px solid #e2e8f0;font-weight:bold;font-family:monospace;font-size:16px;letter-spacing:1px;">
                            {{ $plainPassword }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;color:#64748b;border-top:1px solid #e2e8f0;">Rôle</td>
                        <td style="padding:12px 16px;border-top:1px solid #e2e8f0;font-weight:bold;">
                            {{ ['admin' => 'Administrateur', 'manager' => 'Manager', 'customer' => 'Client'][$user->role] ?? $user->role }}
                        </td>
                    </tr>
                </table>

                <p style="margin:24px 0 0;">
                    <a href="{{ $loginUrl }}"
                       style="display:inline-block;background:#059669;color:#ffffff;font-size:15px;font-weight:bold;padding:13px 26px;border-radius:8px;text-decoration:none;">
                        Se connecter à la plateforme
                    </a>
                </p>
                <p style="margin:14px 0 0;font-size:12px;color:#64748b;word-break:break-all;">
                    Si le bouton ne fonctionne pas, copiez cette adresse : {{ $loginUrl }}
                </p>

                <p style="margin:24px 0 0;padding:14px 16px;background:#fff7ed;border-left:3px solid #f59e0b;font-size:13px;line-height:1.5;">
                    <strong>Sécurité :</strong> ce mot de passe est transmis en clair pour votre première
                    connexion. Changez-le dès votre première connexion et ne le communiquez à personne.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px 28px;background:#f8fafc;font-size:12px;color:#64748b;">
                Message automatique — The Key Group
            </td>
        </tr>
    </table>
</body>
</html>

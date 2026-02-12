<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\SecurityRequestAttributes;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class AppAuthenticator extends AbstractLoginFormAuthenticator
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = 'app_login';

    public function __construct(private UrlGeneratorInterface $urlGenerator)
    {
    }

    public function authenticate(Request $request): Passport
{
    // On récupère les données JSON envoyées par React
    $data = json_decode($request->getContent(), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $request->getSession()->set(SecurityRequestAttributes::LAST_USERNAME, $email);

    return new Passport(
        new UserBadge($email),
        new PasswordCredentials($password),
        [
            new RememberMeBadge(),
        ]
    );
}

    // src/Security/AppAuthenticator.php

public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
{
    // AJOUT : Si la requête vient du Front (React), on répond en JSON
    if ($request->isXmlHttpRequest() || str_contains($request->headers->get('Accept') ?? '', 'json')) {
        return new JsonResponse([
            'message' => 'Connexion réussie',
            'user' => $token->getUserIdentifier(),
            'roles' => $token->getUser()->getRoles(),
        ], 200);
    }

    // Garder la redirection par défaut pour les autres cas
    if ($targetPath = $this->getTargetPath($request->getSession(), $firewallName)) {
        return new RedirectResponse($targetPath);
    }

    return new RedirectResponse($this->urlGenerator->generate('app_home'));
}

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }
}

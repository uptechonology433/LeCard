<?php

namespace App\Controllers\Auth;

use App\DAO\VeroCard\Tokens\TokensDAO;
use App\DAO\VeroCard\Users\UsersDAO;
use App\Models\TokenModel;
use Firebase\JWT\JWT;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response as Response;

final class AuthController
{   

    public function login(Request $request, Response $response, array $args): Response
    {
        $data = $request->getParsedBody();

        $name = $data['name']; // Modificado para pegar o nome em vez do email

        $password = $data['senha']; // Mantido como senha

        if (!trim($name) || !$password) {
            try {
                throw new \Exception("O nome e a senha não foram passados na requisição");
            } catch (\Exception | \Throwable $ex) {
                return $response->withJson([
                    'error' => \Exception::class,
                    'status' => 400,
                    'code' => "002",
                    'userMessage' => 'Dados nulos, passe o nome e a senha',
                    'developerMessage' => $ex->getMessage()
                ], 401);
            }
        }

        $expiredDate = (new \DateTime('now', new \DateTimeZone('America/Sao_Paulo')))->modify('+7 hours')->format('Y-m-d H:i:s');

        $userDAO = new UsersDAO();

        // Alterado para buscar usuário por nome em vez de email
        $user = $userDAO->getUserByName($name);

        if (is_null($user) || $password != $user->getSenha()) {
            try {
                throw new \Exception("Não autorizado!");
            } catch (\Exception | \Throwable $ex) {
                return $response->withJson([
                    'error' => \Exception::class,
                    'status' => 400,
                    'code' => "002",
                    'userMessage' => 'Nome ou senha incorretos',
                    'developerMessage' => $ex->getMessage()
                ], 401);
            }
        }

        $tokenPayload = [
            'sub' => $user->getId(),
            'name' => $user->getNome(),
            'admin' => $user->getAdmin(),
            'expired_at' => $expiredDate
        ];

        $token = JWT::encode($tokenPayload, getenv('JWT_SECRET_KEY'));

        $refreshTokenPayload = [
            'name' => $user->getNome(), // Alterado para nome em vez de email
            'ramdom' => uniqid()
        ];
        $refreshToken = JWT::encode($refreshTokenPayload, getenv('JWT_SECRET_KEY'));

        $tokenModel = new TokenModel();

        $tokenModel->setExpired_at($expiredDate)
            ->setRefresh_token($refreshToken)
            ->setToken($token)
            ->setUsuarios_id($user->getId());

        $tokensDAO = new TokensDAO();

        $tokensDAO->createToken($tokenModel);
            
        $response = $response->withJson([
            'token' => $token,
            'refresh_token' => $refreshToken,
            'admin' => $user->getAdmin()
        ]);
        
        return $response;
    }

    public function refreshToken(Request $request, Response $response, array $args): Response
    {
        $data = $request->getParsedBody();

        $refreshToken = $data['refresh_token'];

        $expiredDate = (new \DateTime('now', new \DateTimeZone('America/Sao_Paulo')))->modify('+7 hours')->format('Y-m-d H:i:s');

        $tokensDAO = new TokensDAO();
        
        $refreshTokenExists = $tokensDAO->verifyRefreshToken($refreshToken);

        if (!$refreshTokenExists) {
            try {
                throw new \Exception("Token de refresh inexistente ou inválido");
            } catch (\Exception | \Throwable $ex) {
                return $response->withJson([
                    'error' => \Exception::class,
                    'status' => 400,
                    'code' => "002",
                    'userMessage' => 'Você não está autorizado, tente novamente mais tarde',
                    'developerMessage' => $ex->getMessage()
                ], 401);
            }
        }

        $tokensDAO->DeleteTokens($refreshToken);

        $refreshTokenDecoded = JWT::decode(
            $refreshToken,
            getenv('JWT_SECRET_KEY'), ['HS256']
         ); 

         $userDAO = new UsersDAO();

         // Alterado para buscar usuário por nome em vez de email
         $user = $userDAO->getUserByName($refreshTokenDecoded->name);

         if (is_null($user))
            return $response->withStatus(401);


        $tokenPayload = [
            'sub' => $user->getId(),
            'name' => $user->getNome(),
            'expired_at' => $expiredDate
        ];

        $token = JWT::encode($tokenPayload, getenv('JWT_SECRET_KEY'));

        $refreshTokenPayload = [
            'name' => $user->getNome(), // Alterado para nome em vez de email
            'ramdom' => uniqid()
        ];

        $refreshToken = JWT::encode($refreshTokenPayload, getenv('JWT_SECRET_KEY'));

        $tokenModel = new TokenModel();

        $tokenModel->setExpired_at($expiredDate)
                    ->setRefresh_token($refreshToken)
                    ->setToken($token)
                    ->setUsuarios_id($user->getId());

        $tokensDAO = new TokensDAO();

        $tokensDAO->createToken($tokenModel);

        $response = $response->withJson([
            'token' => $token,
            'refresh_token' => $refreshToken
        ]);

        return $response;
    }
}
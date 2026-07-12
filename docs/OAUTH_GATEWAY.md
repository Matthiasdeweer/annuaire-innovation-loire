# Guide de configuration - Connexion Decap CMS via Cloudflare Workers

Ce document explique comment mettre en place la passerelle d'authentification pour permettre à la MIFE de se connecter de façon sécurisée à **Decap CMS** pour modifier l'annuaire.

Cette solution est **100% gratuite, stable dans le temps, et ne nécessite pas de renseigner de carte bancaire** lors de la création du compte Cloudflare.

---

## 1. Création de l'application OAuth sur GitHub

Puisque le client a créé un compte GitHub, connectez-vous avec ce compte et suivez ces étapes :

1. Allez dans les **Settings** (Paramètres) du compte GitHub.
2. Tout en bas du menu de gauche, cliquez sur **Developer Settings** (Paramètres de développeur).
3. Cliquez sur **OAuth Apps**, puis sur **Register a new application** (Enregistrer une nouvelle application).
4. Remplissez les champs :
   * **Application name** : `Annuaire Innovation Loire`
   * **Homepage URL** : L'adresse URL de votre site hébergé (ex: `https://votre-client.github.io/projet-mife`)
   * **Authorization callback URL** : L'adresse de votre Worker Cloudflare suivie de `/callback` (ex: `https://annuaire-oauth.votre-compte.workers.dev/callback`) - *Note : Vous pourrez modifier cette valeur après avoir créé le Worker.*
5. Cliquez sur **Register application**.
6. Copiez l'**ID Client** (Client ID).
7. Cliquez sur **Generate a new client secret** (Générer un nouveau secret client) et copiez-le précieusement (il ne s'affiche qu'une seule fois).

---

## 2. Déploiement du Worker Cloudflare

1. Rendez-vous sur [Cloudflare](https://dash.cloudflare.com/) et créez un compte gratuit (pas de carte bleue requise).
2. Dans le menu de gauche, cliquez sur **Workers & Pages**, puis sur **Create Application**.
3. Cliquez sur **Create Worker**. Nommez-le (ex: `annuaire-oauth`) et cliquez sur **Deploy**.
4. Une fois déployé, cliquez sur **Edit Code**.
5. Supprimez tout le code par défaut et collez-y le code suivant :

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/auth") {
      const provider = url.searchParams.get("provider") || "github";
      const scope = url.searchParams.get("scope") || "repo";
      if (provider !== "github") {
        return new Response("Fournisseur non supporté", { status: 400, headers: corsHeaders });
      }
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=${scope}&state=decap-cms`;
      return Response.redirect(githubAuthUrl, 302);
    }
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response(renderResponse("error", { message: "Code manquant." }), {
          headers: { "Content-Type": "text/html", ...corsHeaders }
        });
      }
      try {
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Cloudflare-Worker-Decap-OAuth"
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });
        const data = await tokenResponse.json();
        if (data.error) {
          return new Response(renderResponse("error", { message: data.error_description || data.error }), {
            headers: { "Content-Type": "text/html", ...corsHeaders }
          });
        }
        return new Response(renderResponse("success", { token: data.access_token, provider: "github" }), {
          headers: { "Content-Type": "text/html", ...corsHeaders }
        });
      } catch (err) {
        return new Response(renderResponse("error", { message: err.message }), {
          headers: { "Content-Type": "text/html", ...corsHeaders }
        });
      }
    }
    return new Response("Non trouvé", { status: 404, headers: corsHeaders });
  }
};

function renderResponse(status, content) {
  if (status === "success") {
    return `<!DOCTYPE html><html><head><title>Authentification Réussie</title></head><body><p>Connexion réussie ! Fermeture...</p><script>(function(){window.opener.postMessage("authorization:github:success:" + JSON.stringify({token: "${content.token}", provider: "${content.provider}"}), "*");})();</script></body></html>`;
  } else {
    return `<!DOCTYPE html><html><head><title>Erreur</title></head><body><p style="color:red;">Erreur : ${content.message}</p><script>(function(){window.opener.postMessage("authorization:github:error:${content.message}", "*");})();</script></body></html>`;
  }
}
```

6. Cliquez sur **Save and Deploy**.
7. Revenez en arrière sur la page du Worker. Allez dans l'onglet **Settings** (Paramètres) puis **Variables**.
8. Dans la section **Environment Variables**, ajoutez deux variables :
   * Nom : `GITHUB_CLIENT_ID` / Valeur : L'ID Client copié de GitHub.
   * Nom : `GITHUB_CLIENT_SECRET` / Valeur : Le Client Secret généré sur GitHub.
9. Enregistrez. Votre passerelle d'authentification est prête !

---

## 3. Liaison avec Decap CMS

Dans le fichier `public/admin/config.yml` de votre projet, modifiez le paramètre `auth_endpoint` avec l'adresse de votre Worker :

```yaml
backend:
  name: github
  repo: client-username/annuaire-innovation-loire # Remplacer par le dépôt réel
  branch: main
  auth_endpoint: https://annuaire-oauth.votre-compte.workers.dev/auth # Votre Worker
```

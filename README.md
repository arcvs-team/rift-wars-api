<h3 align="center">
  Rift Wars API
</h3>

<blockquote align="center">API responsible for the operation of the Rift Wars web app.</blockquote>
<br>

<p align="center">
  <a href="#about-the-project">About the project</a><br>
  <a href="#local-development">Local development</a><br>
</p>

## About the project

The Rift Wars API was created to enable all interactivity of the web app. It was built with GraphQL and has usage documentation on Apollo Server.

## Local development

After cloning the repository, you need to have <a href="https://docs.docker.com/desktop/">docker</a> installed, preferably Docker Desktop.

Once you have Docker running, you can start by creating the `.env` file based on the `.env.example`:

```bash
cp .env.example .env
```
After that, you can start the server entering:

```bash
docker compose up -d
```

The server will be hosted on <a href="http://localhost:4000">http://localhost:4000</a> by default.

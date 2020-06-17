const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateID(request, response, next) {
  const { id } = request.params;
  
  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Id is not exits.' })
  }

  return next()
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateID)

const repositories = [];



app.get("/repositories", (request, response) => {
  return response.json( repositories )
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body

    const likes = 0
    const repository = { id: uuid(), title, url, techs, likes }

    repositories.push(repository)

    response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  const { likes } = repositories[repositoryIndex]

  const repository = {
    id, 
    title, 
    url, 
    techs:techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  const repository = repositories[repositoryIndex]

  let { likes } = repository

  repository.likes = likes + 1

  return response.status(200).json(repository)
});

module.exports = app;

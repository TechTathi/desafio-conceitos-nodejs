const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findById (id) {
  return repositories.findIndex(repositorie => repositorie.id == id);
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepositorie);

  return response.json(newRepositorie);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorie = repositories.find( repository => 
    repository.id === id);
  const repositorieIndex = findById(id);

  if (repositorieIndex < 0) {
      return response.status(400).json({ erro: 'Project not found'})
  }

  const upRepositorie = {
      id,
      title,
      url,
      techs,
      likes: repositorie.likes
  };

  repositories[repositorieIndex] = upRepositorie;

  return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = findById(id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ erro: 'Project not found'})
 };

 repositories.splice(repositorieIndex, 1);
 
 return response.sendStatus(204);

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = findById(id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ erro: 'Project not found'})
  };
  repositories[repositorieIndex].likes++

  return response.json({likes: repositories[repositorieIndex].likes});
});

module.exports = app;

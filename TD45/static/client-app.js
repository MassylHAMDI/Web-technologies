export class ClientApp {
    constructor(game) {
        this.game = game;
    }
    // main() {
    //     this.loadIndex();
    // }
    async main() {
      try {        
        const pathname = window.location.pathname;
        if (pathname === '/') {
          await this.loadIndex();
        } else if (pathname.startsWith('/level/')) {
          const lastIndex = pathname.lastIndexOf('/');
          const id = parseInt(pathname.substring(lastIndex + 1));
          await this.loadLevel(id);
        } else {
          this.loadError(404, 'Page non trouvée');
        }
        this.setupLinks();
      } catch (error) {
        this.loadError(500, 'Erreur interne');

      }
    }
    async loadIndex() {
             
        const content = document.getElementById('content');
        content.innerHTML = `
        <br>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Longueur</th>
                    <th>Thème</th>
                    <th>Difficulté</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `;
    await this.addLevels();
    const description = document.querySelector("#level_description");   
    description.textContent = '';
        
    }
    async addLevels() {
        const levels = await this.game.levels();
        for (const level of levels) {
          this.addLevel(level);
        }
      }
    
    addLevel(level) {
        const tbody = document.querySelector('tbody');
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        
        const tdLength = document.createElement('td');
        tdLength.textContent = `${level.length} lettres`;
        tr.appendChild(tdLength);
        
        const tdTheme = document.createElement('td');
        tdTheme.textContent = level.theme;
        tr.appendChild(tdTheme);
        
        const tdDifficulty = document.createElement('td');
        tdDifficulty.textContent = '★'.repeat(level.difficulty);
        tr.appendChild(tdDifficulty);
        
        const tdLink = document.createElement('td');
        const link = document.createElement('a');
        link.href = `/level/${level.id}`; // Add to the test 32
        link.textContent = 'Démarrer';
        tdLink.appendChild(link);
        tr.appendChild(tdLink);

    }
    
    async loadLevel(id) {
      const level = await this.game.level(id);
      const description = document.querySelector("#level_description");
      description.textContent = `${level.theme} (${level.length} lettres)`;
      const content = document.querySelector("#content");
      content.innerHTML = `
        <br>
        <div class="col-4 offset-4">
            <table class="table table-bordered text-center">
                <tbody>
                </tbody>
            </table>
            <div class="input-group mb-3">
                <input type="text" class="form-control">
                <button class="btn btn-outline-secondary">Proposer</button>
            </div>
        </div>`
        await this.addLetters(level.id);
        const button = document.querySelector('button');
        button.onclick = () => this.onSubmitWord(level.id);
        
    }
    async addLetters(id) {
      const letters = await this.game.letters(id);
      const tbody = document.querySelector('tbody');
      const tr = document.createElement('tr');
      
      for (const letter of letters) {
          const td = document.createElement('td');
          td.classList.add('text-bg-primary');
          td.textContent = letter;
          tr.appendChild(td);
      }
      
      tbody.appendChild(tr);
    }
    addLine(line) { 
      const tbody = document.querySelector('tbody');
      const tr = document.createElement('tr');
      
      for (const position of line) {
          const td = document.createElement('td');
          td.classList.add(position.state ? 'text-bg-success' : 'text-bg-danger');
          td.textContent = position.letter;
          tr.appendChild(td);
      }
      
      tbody.appendChild(tr);
    }
    async onSubmitWord(id) {
      const input = document.querySelector('input');
      const word = input.value;
      input.value = '';  // Clear input before await
      const line = await this.game.computeLine(id, word);
      this.addLine(line);
    }
    loadError(code, message) {
      const content = document.querySelector("#content");
      content.innerHTML = `
          <div class="d-flex align-items-center justify-content-center vh-100">
              <div class="text-center">
                  <h1 class="display-1 fw-bold">${code}</h1>
                  <p class="lead">${message}</p>
                  <a href="/" class="btn btn-primary">Retour à la liste des jeux</a>
              </div>
          </div>
      `;
      const levelDescription = document.querySelector("#level_description");
      levelDescription.innerText = '';
  }
    navigateTo(path) {
        window.history.pushState(null, null, path);
        this.main();
    }

    setupLinks() {
        const links = document.querySelectorAll("a");
        for (const link of links) {
            link.onclick = (event) => {
                event.preventDefault();
                this.navigateTo(link.href);
            };
        }
    }
    
}




// Test 30
// export class ClientApp {
//   constructor(game) {
//       this.game = game;
//   }
//   main() {
//       this.loadIndex();
//   }
//   loadIndex() {
//       const content = document.getElementById('content');
//       content.innerHTML = `<b>Bonjour !</b>`;
//   }
// }

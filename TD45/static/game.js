
export class Game {

    async levels() {
        const response = await fetch('/api/levels');
        return await response.json();
    }

    async level(id) {
        const response = await fetch(`/api/level/${id}`);
        return await response.json();
    }


    async letters(id) {
        const response = await fetch(`/api/letters/${id}`);
        return await response.json();
    }

    async computeLine(id, playedWord) {
        const response = await fetch(`/api/line/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: playedWord })
        });
        return await response.json();
    }
}


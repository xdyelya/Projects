document.getElementById('search-button').addEventListener('click', async () => {
    const cocktailName = document.getElementById('cocktail-input').value;
  
    if (!cocktailName) {
        alert('Please enter a cocktail name.');
        return;
    }
  
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);
  
    if (!response.ok) {
        alert('Error fetching data');
        return;
    }
  
    const data = await response.json();
    
    displayCocktails(data.drinks);
  });
  
  function displayCocktails(cocktails) {
    const resultsDiv = document.getElementById('cocktail-results');
    resultsDiv.innerHTML = '';
  
    if (!cocktails) {
        resultsDiv.innerHTML = '<p>No cocktails found.</p>';
        return;
    }
  
    cocktails.forEach(cocktail => {
        const cocktailItem = document.createElement('div');
        cocktailItem.className = 'col-md-4 cocktail-item';
        cocktailItem.innerHTML = `
            <div class="card">
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${cocktail.strDrink}</h5>
                    <button class="btn btn-info" onclick='showCocktailDetails(${JSON.stringify(cocktail)})'>Details</button>
                </div>
            </div>
        `;
        
        resultsDiv.appendChild(cocktailItem);
    });
  }
  
  function showCocktailDetails(cocktail) {
    document.getElementById('modal-title').innerText = cocktail.strDrink;
    document.getElementById('modal-image').src = cocktail.strDrinkThumb;
  
    const instructions = cocktail.strInstructions || 'No instructions available.';
    document.getElementById('modal-instructions').innerText = instructions;
  
    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = '';
  
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        
        if (ingredient) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerText = `${measure ? measure : ''} ${ingredient}`;
            
            const img = document.createElement('img');
            img.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`;
            img.alt = ingredient;
            img.style.width = '30px';
            img.style.marginRight = '10px';
            
            li.prepend(img);
            ingredientsList.appendChild(li);
        }
    }
  
    $('#cocktail-modal').modal('show');
  }
  
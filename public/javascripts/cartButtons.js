const totalPrice = document.querySelector('.total');
let sum = 0;
document.querySelectorAll('.pagination').forEach(pagination => {
  const delButtons = pagination.querySelectorAll('.delButton');
  const valueLinks = pagination.querySelectorAll('.value');
  const plusButtons = pagination.querySelectorAll('.plus');
  const minusButtons = pagination.querySelectorAll('.minusButton');
  const prices = pagination.querySelectorAll('.price').innerText

  valueLinks.forEach((value, index) => {
    value.innerText = 1;
   
    plusButtons[index].addEventListener('click', function () {
      value.innerText++;
      console.log(prices[index])
      if (parseInt(value.innerText) === 1) {
        delButtons[index].style.display = 'block';
        minusButtons[index].style.display = 'none';
      } else {
        minusButtons[index].style.display = 'block';
        delButtons[index].style.display = 'none';
      }
    });

    minusButtons[index].addEventListener('click', function () {
      if (parseInt(value.innerText) > 1) {
        value.innerText--;
        if (parseInt(value.innerText) === 1) {
          delButtons[index].style.display = 'block';
          minusButtons[index].style.display = 'none';
        } else {
          minusButtons[index].style.display = 'block';
          delButtons[index].style.display = 'none';
        }
      }
    });

    delButtons[index].addEventListener('click', function () {
      value.innerText--;
      sum += price * value;
      totalPrice.innerText = sum;
      if (parseInt(value.innerText) === 1) {
        delButtons[index].style.display = 'block';
        minusButtons[index].style.display = 'none';
      } else {
        minusButtons[index].style.display = 'block';
        delButtons[index].style.display = 'none';
      }
    });
  });
});
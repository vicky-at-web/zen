const options = document.querySelectorAll('#option');
options.forEach((option, index) => {
  option.addEventListener('mouseover', () => {
    options[index].classList.add('shadow')
  })
  option.addEventListener('mouseout', () => {
    options[index].classList.remove('shadow')
  })
})

const input = document.querySelector('#searchInput');
const button = document.querySelector('#searchButton');

input.addEventListener('input', function(){
 if(input.value){
  button.classList.remove('d-none');
  input.style.border ='1px solid rgba(0, 0, 0, 0.20)'
 }else{
  button.classList.add('d-none');
  input.style.border ='0px'
 }
});

import {calculateRunway} from './starting-point-engine.mjs';
for(const root of document.querySelectorAll('[data-runway]')){
 const form=root.querySelector('form'),number=root.querySelector('[data-runway-number]'),reading=root.querySelector('[data-runway-reading]'),band=root.querySelector('[data-runway-band]');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  try{
   const value=name=>{const raw=form.elements[name].value.trim();if(raw===''&&name!=='income')throw new Error('Enter reserves and monthly costs.');return raw===''?0:Number(raw);};
   const result=calculateRunway(value('reserve'),value('costs'),value('income'));
   if(result.covered){number.textContent='No current drawdown';reading.textContent='Reliable continuing income covers the stated costs under these assumptions. Test how long that income would last and what happens if it stops.';band.textContent='This is not infinite runway or a retirement conclusion.';}
   else{const value=result.months<0.1&&result.months>0?'less than 0.1':(Math.floor(result.months*10)/10).toLocaleString('en-IN',{maximumFractionDigits:1});number.textContent='Your runway: '+value+' months';reading.textContent=result.band.line;band.textContent=result.band.label+'. Display rounded down to one decimal; the band uses the unrounded result.';}
  }catch(error){number.textContent='Check your inputs';reading.textContent=error.message;band.textContent='';}
 });
}

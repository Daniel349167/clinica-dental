<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

type QA = { q: string, a: { es:string, ca:string, en:string }, keywords: string[] };

const props = defineProps<{ locale:'es'|'ca'|'en' }>();

const open = ref(false);
const input = ref('');
const messages = ref<{from:'bot'|'user', text:string}[]>([]);

const KB: QA[] = [
  {
    q: 'horario',
    a: {
      es:'Atendemos de lunes a viernes de 9:00 a 19:00.',
      ca:'Atenem de dilluns a divendres de 9:00 a 19:00.',
      en:'We are open Monday to Friday, 9:00 to 19:00.'
    },
    keywords:['horario','hora','abren','cierran','hours','open']
  },
  {
    q:'precio blanqueamiento',
    a:{
      es:'El blanqueamiento parte desde 199€ según evaluación.',
      ca:'L’emblanquiment parteix des de 199€ segons valoració.',
      en:'Whitening starts from €199 depending on evaluation.'
    },
    keywords:['precio','coste','blanqueamiento','whitening','cost']
  },
  {
    q:'urgencias',
    a:{
      es:'Sí, atendemos urgencias el mismo día. Llama al +34 600 000 000.',
      ca:'Sí, atenem urgències el mateix dia. Truca al +34 600 000 000.',
      en:'Yes, we handle same-day emergencies. Call +34 600 000 000.'
    },
    keywords:['urgencia','emergencia','dolor','emergency']
  },
];

const T = {
  es:{ hi:'¡Hola! Soy tu asistente dental 😊 ¿En qué te ayudo?', fallback:'No estoy seguro de eso. ¿Quieres que coordinemos una cita?', ask:'Escribe tu pregunta…', book:'Pedir cita' },
  ca:{ hi:'Hola! Soc el teu assistent dental 😊 En què t’ajudo?', fallback:'No n’estic segur. Vols que coordinem una cita?', ask:'Escriu la teva pregunta…', book:'Demanar cita' },
  en:{ hi:'Hi! I’m your dental assistant 😊 How can I help?', fallback:'Not sure about that. Would you like to book an appointment?', ask:'Type your question…', book:'Book appointment' },
}[props.locale];

function findAnswer(text:string){
  const t = text.toLowerCase();
  for(const qa of KB){
    if(qa.keywords.some(k => t.includes(k))) return qa.a[props.locale];
  }
  return T.fallback;
}

function send(){
  const text = input.value.trim();
  if(!text) return;
  messages.value.push({from:'user', text});
  const reply = findAnswer(text);
  messages.value.push({from:'bot', text: reply});
  input.value='';
  nextTick(()=> {
    const box = document.getElementById('chatbox'); if(box) box.scrollTop = box.scrollHeight;
  });
}

onMounted(()=>{
  messages.value.push({from:'bot', text:T.hi});
});
</script>

<template>
  <div style="position:fixed; right:18px; bottom:18px; z-index:50;">
    <button class="btn" @click="open=!open">{{ open ? '×' : 'Chat' }}</button>
    <div v-if="open" class="card" style="width:min(360px, 92vw); margin-top:8px;">
      <div id="chatbox" style="height:300px; overflow:auto; border:1px solid #eef3f8; border-radius:12px; padding:10px; background:var(--brand-50)">
        <div v-for="(m,i) in messages" :key="i" :style="{textAlign: m.from==='user'?'right':'left', margin:'6px 0'}">
          <span :style="{
            display:'inline-block', padding:'8px 10px', borderRadius:'12px',
            background: m.from==='user'?'#fff':'#dff4ff', color:'var(--text-900)'}">{{ m.text }}</span>
        </div>
      </div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <input :placeholder="T.ask" v-model="input" @keyup.enter="send" style="flex:1; padding:10px; border-radius:12px; border:1px solid #cfe3f3"/>
        <button class="btn" @click="send">→</button>
      </div>
      <div style="margin-top:8px; text-align:right;">
        <a href="#cita" class="btn">{{ T.book }}</a>
      </div>
    </div>
  </div>
</template>

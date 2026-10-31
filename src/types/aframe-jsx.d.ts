// A-Frame mendaftarkan custom elements (a-scene, a-sky, dst) langsung ke DOM,
// bukan lewat komponen React. @types/aframe tidak menyediakan definisi JSX,
// jadi kita deklarasikan sendiri secara longgar di sini supaya TypeScript
// tidak menolak elemen-elemen ini di file .tsx manapun.
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-sky': any;
    'a-camera': any;
    'a-entity': any;
    'a-cursor': any;
    'a-assets': any;
    'a-asset-item': any;
  }
}

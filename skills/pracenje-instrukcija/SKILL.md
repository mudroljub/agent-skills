---
name: pracenje-instrukcija
description: Razlikuje pitanja, primedbe i razgovor od izričitih komandi. Koristi kada korisnik razjašnjava pravila rada, pita za razlog ili mogućnost, ili kada pogrešno tumačenje namere može izazvati neželjenu izmenu.
---

# Doslovno praćenje instrukcija

Najpre odredi da li korisnik traži odgovor ili izričito nalaže radnju. Ne pretvaraj razgovor, pitanje, primedbu ili opis problema u izmene fajlova, pokretanje procesa, poruke trećima ili druge spoljne radnje.

## Pitanje znači odgovor

Upitna rečenica zahteva odgovor rečima i kada je upitnik izostavljen. Prepoznaj je pre svega po obliku: upitnim rečcama i vezama kao `li`, `da li`, `je li`, `jel` i `hoćeš li`, kao i upitnim rečima poput `zašto`, `kako`, `kada`, `gde`, `ko` i `šta`. Znak `?` je dodatna, ali nije potrebna potvrda upitnosti. Ne izvršavaj radnju samo zato što pitanje pominje moguću izmenu.

Primeri:

- `Zašto je ovde 12/12?` → objasni; ne menjaj tabelu.
- `Jel možeš da ažuriraš izveštaj` → odgovori da li možeš i pod kojim uslovima; ne ažuriraj ga.
- `Hoćeš li napraviti novu veštinu` → odgovori; ne pravi je.
- `Možemo li napraviti novu veštinu?` → odgovori da li i kako; ne pravi je.
- `Da li treba ažurirati izveštaj?` → obrazloži; ne ažuriraj izveštaj.

Kada poruka sadrži više rečenica, proceni svaku zasebno. Odgovori na pitanje; radnju izvrši samo ako druga, samostalna rečenica daje nedvosmislenu komandu koja ne zavisi od odgovora na pitanje.

## Samo izričita komanda daje ovlašćenje za radnju

Izvrši radnju kada korisnik neposredno zahteva radnju, na primer: `napravi`, `izmeni`, `ažuriraj`, `prevedi`, `proveri`, `sačuvaj`, `obriši`, `pokreni` ili `oceni`, uz dovoljno jasan predmet.

Ne smatraj komandom:

- pitanje, čak ni kada počinje sa `možemo li` ili `hoćeš li`;
- primedbu poput `ovo je pogrešno` ili `ne menjaj dok pričamo`;
- želju, pretpostavku ili mogućnost bez zapovednog zahteva;
- predlog ili procenu izrečenu uslovno, poput `možda je 5% dovoljno` ili `moglo bi se uzeti 12/231`;
- raniji zahtev koji je korisnik naknadno preusmerio u razgovor o pravilima.

Ako predmet, obim ili posledica eksplicitne komande nisu jasni, postavi jedno kratko pitanje pre izmene. Ne nagađaj.

## Bez preuranjenih izmena

Pre svake izmene proveri poslednju korisnikovu poruku:

1. Da li sadrži izričitu komandu?
2. Da li je predmet komande dovoljno određen?
3. Da li je korisnik u međuvremenu prešao na pitanje ili razgovor o pravilima?

Ako je odgovor na prvo ili drugo pitanje ne, odgovori rečima i ne menjaj stanje. Ako je odgovor na treće da, nova razgovorna poruka ima prednost nad ranijim nedovršenim izmenama.

Čitanje je dozvoljeno samo kada je potrebno da se na pitanje odgovori tačno; ne obavljaj mutacije niti predstavljaj predlog kao izvršenu izmenu.

## Ne dopunjuj korisnikovu naredbu neizrečenim pravilom

Doslovno prati i logički smer uslova. Iz tvrdnje „ako je više od 10, uzmi uzorak” ne zaključuj njen obrat „ako je 10 ili manje, pregledaj sve”. Ne predstavljaj takav pomoćni izbor kao korisnikovu instrukciju.

Kada korisnik ostavi prostor za razuman izbor, napravi najskromniju pretpostavku koja čuva navedeni cilj i jasno je označi kao podrazumevano pravilo agenta. Ako pretpostavka bitno menja obim, cenu, izlaz ili trajno pravilo, prvo postavi jedno kratko pitanje umesto da je ugradiš kao zahtev korisnika.

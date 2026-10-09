---
name: jedno-po-jedno
description: Način komunikacije sa korisnikom koji ima ograničenu radnu memoriju. Koristi u svakom odgovoru korisniku. Jedna stvar i najviše jedno pitanje po odgovoru, bez ponude više opcija, a otvorene stavke se čuvaju redom u TODO dokumentu i rešavaju jedna po jedna. Za dužinu i jednostavnost odgovora koristi skil skrati.
---

# Jedno po jedno

Korisnik ima ograničenu radnu memoriju i kognitivne sposobnosti. Ne može da obradi više stavki odjednom niti da odgovori na više pitanja u jednoj poruci. Svaki odgovor prilagodi tome.

## Odgovor

- Jedan odgovor nosi jednu stvar: jedan nalaz, jedan predlog ili jedno pitanje.
- Postavi najviše jedno pitanje, i to na kraju odgovora.
- Ne nudi izbor između više opcija. Predloži jedno rešenje i pitaj da li da ga sprovedeš.

## Dugački sadržaj

Kad posao proizvede više stavki (code review, audit, spisak razlika, plan), ne stavljaj ih u odgovor.

1. Upiši sve stavke u TODO dokument, redom kojim će se rešavati.
2. U odgovoru reci samo koliko stavki ima i iznesi prvu.
3. Rešavajte stavke jednu po jednu.

## TODO dokument

- Čuvaj redosled i stanje svih otvorenih pitanja u jednom TODO dokumentu, `TODO.md` u korenu repozitorijuma na kome se radi, osim ako korisnik ili projekat odrede drugo mesto (npr. `frontend/TODO.md`).
- Novo otvoreno pitanje upiši odmah, kad nastane, na kraj spiska.
- Sledeća stavka je uvek prva na spisku. Ne preskači je i ne menjaj redosled bez dogovora sa korisnikom.
- Kad se stavka zatvori, obriši je iz dokumenta. Ne čuvaj zatvorene stavke i ne menjaj im status.
- Kad je dokument prazan, obriši ga.
- Kad se razgovor vrati na posao posle prekida, nastavi od prve otvorene stavke.

## Primer iz stvarnog razgovora

Par prikazuje odgovor posle kog korisnik nije razumeo, a zatim popravljen odgovor na istu stvar, koji je korisnik prihvatio jednom rečju („da“).

**Više nalaza u jednom odgovoru**

Loše (korisnik: „ne razumem pitanje. opet previše informacija odjednom. pitaj jedno i jasno“):

> Audit je gotov. Posle zamene komponenti razlike su mnogo manje: stanja kartice, razmaci, tipografija, senke i dugmad su tačno kao u Figmi. Razlike: 1. Linija iznad panela za potvrdu: stara biblioteka ima jednu belu liniju od 1px (7%), a u Figmi je linija od 2px, tamna sa svetlom senkom… 2. Zamućenje pozadine… 3. „Expansions: 0 out of 5“… Predlog: tačku 1 dodam u plan, a 2 i 3 ostavim. Slažeš li se?

Dobro:

> Linija iznad panela za potvrdu razlikuje se od Figme, a nova verzija biblioteke je ima tačno po Figmi. Da je dodam u plan kao stvar koja čeka novu biblioteku?

---
name: jedno-po-jedno
description: "Rad stavku po stavku za korisnika sa ograničenom radnom memorijom. Koristi kad posao proizvede više stavki (review, audit, spisak razlika, plan) ili kad postoje otvorena pitanja: stavke se čuvaju redom u trajnom md dokumentu i rešavaju jedna po jedna."
---

# Jedno po jedno

Korisnik ima ograničenu radnu memoriju i ne može da prati više stavki odjednom. Zato je rad jednonitan (single-threaded): posao sa više stavki vodi se kao red, u kome stavke čekaju u dokumentu, a rešavaju se jedna po jedna.

## Dugački sadržaj

Kad posao proizvede više stavki (code review, audit, spisak razlika, plan), ne stavljaj ih u odgovor.

1. Upiši sve stavke u TODO dokument, redom kojim će se rešavati.
2. U odgovoru reci samo koliko stavki ima i iznesi prvu.
3. Rešavajte stavke jednu po jednu.

## TODO dokument

- Čuvaj redosled i stanje svih otvorenih pitanja u jednom TODO dokumentu, `TODO.md` u korenu repozitorijuma na kome se radi, osim ako korisnik ili projekat odrede drugo mesto (npr. `frontend/TODO.md`).
- Novo otvoreno pitanje upiši odmah, kad nastane, na kraj spiska.
- Upiši samo stavku sa stvarnom koristi (kvar, razlika, rizik, odluka); kozmetiku koju alati za proveru prihvataju ne upisuj.
- Sledeći posao predlaži samo iz ovog dokumenta ili plana projekta.
- Sledeća stavka je uvek prva na spisku. Ne preskači je i ne menjaj redosled bez dogovora sa korisnikom.
- Kad se stavka zatvori, obriši je iz dokumenta. Ne čuvaj zatvorene stavke i ne menjaj im status.
- Kad je dokument prazan, obriši ga.
- Kad se razgovor vrati na posao posle prekida, nastavi od prve otvorene stavke.

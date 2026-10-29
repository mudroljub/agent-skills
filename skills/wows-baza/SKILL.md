---
name: wows-baza
description: "Uputi agenta u lokalnu bazu znanja za World of Warships klijent (C:\\Source\\wows_docs) pre rada na migraciji UI-ja na Gameface, data providerima, Unbound kodu ili Dockyard/Shipyard funkciji. Koristi na početku svake takve sesije, pre ponovnog istraživanja koda, Jira-e ili Confluence-a."
---

# WoWS baza znanja

Baza znanja čuva ono što je već istraženo: odluke tima, strukturu koda, provere u izvornom kodu i otvorena pitanja. Cilj je da sesija krene od tog znanja umesto od nule i da se tokeni ne troše na ponovno istraživanje.

## Pre rada

1. Pročitaj `C:\Source\wows_docs\README.md`. To je mapa baze, sa pravilima i pristupom spoljnim sistemima.
2. Pročitaj README dela koji se tiče zadatka, i samo njega:
   - migracija Dockyard-a: `dockyard-migration\README.md`, zatim `dockyard-migration\odluke.md`;
   - Gameface i data provideri: `gameface\data-provider-vodic.md`, `gameface\tutorial-intro.md`;
   - Unbound: `unbound\README.md`, zatim odgovarajući šalabahter.
3. Velike fajlove ne čitaj cele. Pretraži ih po pojmu i čitaj samo pogođeni odeljak.
4. Kad zadatak zavisi od stanja u Jira-i, Confluence-u ili repozitorijumima, pokreni `python C:\Source\wows_docs\tools\osvezi.py`. Ako alat prijavi promene, reci korisniku koji fajl baze je zastareo, pre nego što se osloniš na njega.

## Pravila

- **Izvorni kod je jedini izvor istine.** Dokumenti, pa i ova baza, mogu da greše. Tvrdnju koja je bitna za odluku ili implementaciju proveri u kodu i navedi `fajl:linija`. Sporove između dokumenata rešavaj čitanjem koda, ne izborom novijeg dokumenta.
- **Odluke iz `odluke.md` važe** dok ih korisnik ne promeni. Pretpostavke su označene kao pretpostavke; nemoj ih predstavljati kao odlučeno.
- **Ne izmišljaj odluke.** Novu odluku upiši u `odluke.md` tek kad je korisnik donese i potvrdi da je treba upisati.
- **Bazu drži malom.** Puna ili zastarela verzija ide u `arhiva\`. Glavni fajlovi sadrže samo ono što treba za rad. Linkovi su relativni.
- **Zaglavlje svakog fajla** ima izvore, datum stanja, commit koda i status provere. Kad menjaš fajl, ažuriraj i zaglavlje.
- **Jezik baze je srpski, latinica.** Identifikatori, putanje i kod ostaju doslovni.
- **Tajne nikad ne upisuj** u bazu, skil ni poruku. Pristup spoljnim sistemima opisan je u README-u baze. Tokene čitaj iz promenljivih okruženja i nikad ih ne ispisuj.

## Posle rada

- Kad nešto novo saznaš iz koda ili izvora, a to će trebati kasnije, dopuni odgovarajući fajl baze, uz `fajl:linija`, i ažuriraj datum u zaglavlju.
- Posle osvežavanja fajlova na osnovu promena koje je prijavio `osvezi.py`, sačuvaj nov snimak sa `python C:\Source\wows_docs\tools\osvezi.py --save`.
- Ne pravi nove fajlove ako postojeći fajl odgovarajuće teme može da se dopuni.

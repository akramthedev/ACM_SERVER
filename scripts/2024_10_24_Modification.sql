-- Changement Prestation CFE et CNSS Prod

update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='7ed35e6a-82f1-4bd2-8f9e-421e4c366654'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='17172b4d-bb22-471a-bf50-6e9f61d237c9'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='b9df4476-f02d-44a2-808e-84b61ca961b8'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='4e67a3bb-0994-4b3e-be7e-89c5d96c7786'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='76284d7a-821d-4360-a2d6-8a5f67814972'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='0fb513d2-c5ea-431f-af82-d6f7c04efc0f'
update Tache set PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' where TacheId='990b00bd-fc7f-4ce6-b202-d7ca0b02792f'

INSERT INTO Tache (TacheId,PrestationId,AgentId,Intitule,Numero_Ordre,Deadline,NombreRapelle,Honoraire,Priorite) VALUES (NEWID(),'55017a79-a7a2-493b-853b-97c33df4d139','3d9d1ac0-ac20-469e-be24-97cb3c8c5187','Ouverture du dossier N°7 Santé avec formulaire interne/ couverture','T20',0,0,0,'')
  
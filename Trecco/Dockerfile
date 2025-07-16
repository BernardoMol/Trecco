FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copia os projetos
COPY ./BibliotecaSUPABASE ./BibliotecaSUPABASE
COPY ./ApiTreccoRENDER ./ApiTreccoRENDER

# Restaura e publica a API
WORKDIR /app/ApiTreccoRENDER
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview
WORKDIR /app

# Copia a aplicação publicada
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "ApiTreccoRENDER.dll"]

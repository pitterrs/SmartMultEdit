@EndUserText.label: 'Seleção de títulos para prorrogação'
@ObjectModel.query.implementedBy: 'ABAP:ZCL_FI_RETRIEVE_TITLES'

@UI: {

    headerInfo: {
    
        typeName: 'Seleção de Títulos',
        typeNamePlural: 'Seleção de Tíitulos',
        title: {
            type: #STANDARD,
            value: 'NOME_CP'
        }
    
    }

}

@Search.searchable: true
define root custom entity zce_prorroga_vencimento
{

    @UI: {
    
        identification: [{position: 10}],
        selectionField: [{position: 10}],
        fieldGroup:     [{qualifier: 'changes'}],
        lineItem:       [
        {
        
            position:    30,
            criticality: 'COD_CP',
            importance:  #HIGH
        
        },
        {
        
            type:   #FOR_ACTION,
            invocationGrouping: #CHANGE_SET,
            position:   10,
            dataAction: 'prorrogar',
            label:  'Solicitar Prorrogação'
        
        }
        ],
        facet:  [
            {
                type: #IDENTIFICATION_REFERENCE,
                purpose: #STANDARD,
                label: 'Informações do Título',
                id: 'prorrogar',
                position: 10
            },
            {
                type: #FIELDGROUP_REFERENCE,
                label: 'Dados para Prorrogação',
                targetQualifier: 'change',
                id: 'prorrogacao',
                position: 20
            }
        ]
    
    }
    
//    @UI              : {
//        lineItem         : [{position: 30, importance: #MEDIUM}],
//        identification   : [{position: 30}],
//        selectionField   : [{position: 20}]
//      }
    key BUKRS   : bukrs;
    @UI              : {
        lineItem         : [{position: 40, importance: #MEDIUM}],
        identification   : [{position: 40}],
        selectionField   : [{position: 30}]
      }
    key BELNR   : belnr_d;
    @UI              : {
        lineItem         : [{position: 50, importance: #MEDIUM}],
        identification   : [{position: 50}],
        selectionField   : [{position: 40}]
      }
    key GJAHR   : gjahr;
    @UI              : {
        lineItem         : [{position: 60, importance: #MEDIUM}],
        identification   : [{position: 60}]
      }
    key BUZEI   : buzei;
    @UI              : {
        lineItem         : [{position: 10, importance: #MEDIUM}],
        identification   : [{position: 10}]
      }
    @Search.defaultSearchElement: true
    @EndUserText.label: 'Código CP'
    COD_CP  : kunn2;
    @UI              : {
        lineItem         : [{position: 20, importance: #HIGH}],
        identification   : [{position: 20}]
      }
    @EndUserText.label: 'Razão Soc. CP'
    NOME_CP : name1_gp;
    @UI              : {
        lineItem         : [{position: 70, importance: #MEDIUM}],
        identification   : [{position: 70}],
        selectionField   : [{position: 70}]
      }
    BLART   : blart;
    @UI              : {
        lineItem         : [{position: 80, importance: #MEDIUM}],
        identification   : [{position: 80}],
        selectionField   : [{position: 80}]
      }
    BUDAT   : budat;
    @UI              : {
        lineItem         : [{position: 90, importance: #MEDIUM}],
        identification   : [{position: 90}],
        selectionField   : [{position: 90}]
      }
    @EndUserText.label: 'Código Loja'
    COD_LOJA : kunnr;
    @UI              : {
        lineItem         : [{position: 100, importance: #MEDIUM}],
        identification   : [{position: 100}]
      }
    @EndUserText.label: 'Rozão Soc. Lj'
    NOME_LOJA : name1_gp;
    @UI              : {
        lineItem         : [{position: 120, importance: #MEDIUM}],
        identification   : [{position: 120}]
      }
    @EndUserText.label: 'Código RG'
    COD_GR  : kunnr;
    @UI              : {
        lineItem         : [{position: 130, importance: #MEDIUM}],
        identification   : [{position: 130}]
      }
    @EndUserText.label: 'Consultor'
    CONSULTOR : pernr_d;
    @UI              : {
        lineItem         : [{position: 140, importance: #MEDIUM}],
        identification   : [{position: 140}],
        selectionField   : [{position: 140}]
      }
    XBLNR   : xblnr1;
    @UI              : {
        lineItem         : [{position: 150, importance: #MEDIUM}],
        identification   : [{position: 150}]
      }
    @EndUserText.label: 'Valor da Parcela'
    VLR_NF : abap.dec(13,2);
    @UI              : {
        lineItem         : [{position: 160, importance: #MEDIUM}],
        identification   : [{position: 160}]
      }
    VENCIMENTO : dfaell;
    @UI              : {
        lineItem         : [{position: 170, importance: #MEDIUM}],
        identification   : [{position: 170}]
      }
    KKBER : kkber;
    @UI              : {
        lineItem         : [{position: 180, importance: #MEDIUM}],
        identification   : [{position: 180}]
      }
    CTLPC : ctlpc_cm;
    @UI              : {
        lineItem         : [{position: 190, importance: #MEDIUM}],
        identification   : [{position: 190}]
      }
    ZTERM : dzterm;
    @UI              : {
        fieldGroup: [{ qualifier: 'change', position: 10 }],
        lineItem         : [{ importance: #LOW }]
      }
    @EndUserText.label: 'Motivo'
    @Consumption.filter.hidden: true
    MOTIVO : abap.char(60);
    @UI              : {
        fieldGroup: [{ qualifier: 'change', position: 20 }],
        lineItem         : [{ importance: #LOW }]
      }
    @EndUserText.label: 'Justificativa'
    JUSTIFICATIVA : abap.char(120);
    @UI              : {
        fieldGroup: [{ qualifier: 'change', position: 30 }],
        lineItem         : [{ importance: #LOW }]
      }
    @EndUserText.label: 'Nova Dt. Vencimento'
    NOVO_VENCIMENTO : abap.dats;
}














